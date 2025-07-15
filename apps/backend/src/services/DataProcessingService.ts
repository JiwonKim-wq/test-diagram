import { FilterEngine, AggregateEngine, TransformEngine } from '@diagram/utils';
import { 
  FilterRule, 
  FilterOperator, 
  AggregationRule, 
  AggregateFunction, 
  TransformRule, 
  TransformType, 
  TransformOperation,
  ProcessingResult 
} from '@diagram/common';

export class DataProcessingService {
  private filterEngine: FilterEngine;
  private aggregateEngine: AggregateEngine;
  private transformEngine: TransformEngine;

  constructor() {
    this.filterEngine = new FilterEngine();
    this.aggregateEngine = new AggregateEngine();
    this.transformEngine = new TransformEngine();
  }

  /**
   * 데이터에 필터링 규칙을 적용합니다.
   */
  async filterData(data: any[], filterRules: FilterRule[]): Promise<any[]> {
    if (!data || data.length === 0) {
      return [];
    }

    if (!filterRules || filterRules.length === 0) {
      return data;
    }

    // common 타입을 utils 엔진의 로컬 타입으로 변환하고 enabled를 true로 설정
    const localRules = filterRules.map(rule => ({
      ...this.convertToLocalFilterRule(rule),
      enabled: rule.enabled !== false // undefined나 true면 true로 설정
    }));

    // 여러 필터를 한번에 적용 (AND 조건)
    return this.filterEngine.applyFilters(data, localRules, 'AND');
  }

  /**
   * 데이터에 집계 규칙을 적용합니다.
   */
  async aggregateData(
    data: any[], 
    aggregationRules: AggregationRule[], 
    groupBy: string[] = []
  ): Promise<any[]> {
    if (!data || data.length === 0) {
      return [];
    }

    if (!aggregationRules || aggregationRules.length === 0) {
      return data;
    }

    // common 타입을 utils 엔진의 로컬 타입으로 변환하고 enabled를 true로 설정
    const localRules = aggregationRules.map(rule => ({
      ...this.convertToLocalAggregationRule(rule),
      enabled: rule.enabled !== false
    }));

    return this.aggregateEngine.aggregate(data, groupBy, localRules);
  }

  /**
   * 데이터에 변환 규칙을 적용합니다.
   */
  async transformData(data: any[], transformRules: TransformRule[]): Promise<any[]> {
    if (!data || data.length === 0) {
      return [];
    }

    if (!transformRules || transformRules.length === 0) {
      return data;
    }

    // common 타입을 utils 엔진의 로컬 타입으로 변환하고 enabled를 true로 설정
    const localRules = transformRules.map(rule => ({
      ...this.convertToLocalTransformRule(rule),
      enabled: rule.enabled !== false
    }));

    let transformedData = this.transformEngine.transform(data, localRules);

    // RENAME 연산의 경우 원본 필드 삭제
    const renameRules = transformRules.filter(rule => rule.operation === TransformOperation.RENAME);
    if (renameRules.length > 0) {
      transformedData = transformedData.map(item => {
        const newItem = { ...item };
        renameRules.forEach(rule => {
          if (rule.enabled !== false && newItem.hasOwnProperty(rule.sourceField)) {
            delete newItem[rule.sourceField];
          }
        });
        return newItem;
      });
    }

    return transformedData;
  }

  /**
   * 데이터에 필터링, 집계, 변환을 순차적으로 적용합니다.
   */
  async processData(
    data: any[],
    filterRules: FilterRule[] = [],
    aggregationRules: AggregationRule[] = [],
    transformRules: TransformRule[] = [],
    groupBy: string[] = []
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const originalCount = data.length;

    try {
      // 1. 필터링
      let processedData = await this.filterData(data, filterRules);
      const filteredCount = processedData.length;

      // 2. 집계 (그룹화가 있는 경우에만)
      if (aggregationRules.length > 0) {
        processedData = await this.aggregateData(processedData, aggregationRules, groupBy);
      }

      // 3. 변환
      if (transformRules.length > 0) {
        processedData = await this.transformData(processedData, transformRules);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: processedData,
        metadata: {
          totalRecords: originalCount,
          processedRecords: processedData.length,
          processingTime,
          affectedFields: this.getAffectedFields(filterRules, aggregationRules, transformRules)
        }
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다',
        metadata: {
          totalRecords: originalCount,
          processedRecords: 0,
          processingTime: Date.now() - startTime,
          affectedFields: []
        }
      };
    }
  }

  /**
   * common 패키지의 FilterRule을 utils 엔진의 로컬 타입으로 변환
   */
  private convertToLocalFilterRule(rule: FilterRule): any {
    return {
      id: rule.id,
      field: rule.field,
      operator: rule.operator, // enum 값은 동일하므로 그대로 사용
      value: rule.value,
      dataType: rule.dataType,
      caseSensitive: rule.caseSensitive,
      enabled: rule.enabled
    };
  }

  /**
   * common 패키지의 AggregationRule을 utils 엔진의 로컬 타입으로 변환
   */
  private convertToLocalAggregationRule(rule: AggregationRule): any {
    return {
      id: rule.id,
      field: rule.field,
      function: rule.function, // enum 값은 동일하므로 그대로 사용
      alias: rule.alias,
      distinct: rule.distinct,
      enabled: rule.enabled
    };
  }

  /**
   * common 패키지의 TransformRule을 utils 엔진의 로컬 타입으로 변환
   */
  private convertToLocalTransformRule(rule: TransformRule): any {
    // TransformOperation을 utils 엔진의 TransformFunction으로 매핑
    const functionMapping: Record<string, string> = {
      [TransformOperation.RENAME]: 'rename',
      [TransformOperation.COPY]: 'copy',
      [TransformOperation.TO_STRING]: 'cast',
      [TransformOperation.TO_NUMBER]: 'cast',
      [TransformOperation.TO_BOOLEAN]: 'cast',
      [TransformOperation.TO_DATE]: 'cast',
      [TransformOperation.ADD]: 'mathOperation',
      [TransformOperation.SUBTRACT]: 'mathOperation',
      [TransformOperation.MULTIPLY]: 'mathOperation',
      [TransformOperation.DIVIDE]: 'mathOperation',
      [TransformOperation.MODULO]: 'mathOperation',
      [TransformOperation.UPPER_CASE]: 'upper',
      [TransformOperation.LOWER_CASE]: 'lower',
      [TransformOperation.TRIM]: 'trim',
      [TransformOperation.SUBSTRING]: 'substring',
      [TransformOperation.REPLACE]: 'replace',
      [TransformOperation.SPLIT]: 'split',
      [TransformOperation.CONCAT]: 'concat',
      [TransformOperation.FORMAT_DATE]: 'dateFormat',
      [TransformOperation.IF_THEN_ELSE]: 'conditional',
      [TransformOperation.CASE_WHEN]: 'conditional'
    };

    const transformFunction = functionMapping[rule.operation] || 'custom';
    let parameters: any = {
      ...rule.parameters,
      operation: rule.operation,
      type: rule.type
    };

    // CONCAT 연산의 경우 sourceField를 fields 배열로 변환
    if (rule.operation === TransformOperation.CONCAT) {
      const fields = rule.sourceField.split(',').map(field => field.trim());
      parameters = {
        ...parameters,
        fields: fields,
        separator: rule.parameters?.separator || ' '
      };
    }

    return {
      id: rule.id,
      sourceField: rule.sourceField,
      targetField: rule.targetField,
      function: transformFunction,
      parameters,
      enabled: rule.enabled
    };
  }

  /**
   * 처리 과정에서 영향받은 필드들을 추출합니다.
   */
  private getAffectedFields(
    filterRules: FilterRule[],
    aggregationRules: AggregationRule[],
    transformRules: TransformRule[]
  ): string[] {
    const fields = new Set<string>();

    filterRules.forEach(rule => fields.add(rule.field));
    aggregationRules.forEach(rule => fields.add(rule.field));
    transformRules.forEach(rule => {
      fields.add(rule.sourceField);
      fields.add(rule.targetField);
    });

    return Array.from(fields);
  }
} 