var TransformFunction;
(function (TransformFunction) {
    TransformFunction["RENAME"] = "rename";
    TransformFunction["CAST"] = "cast";
    TransformFunction["SUBSTRING"] = "substring";
    TransformFunction["REPLACE"] = "replace";
    TransformFunction["UPPER"] = "upper";
    TransformFunction["LOWER"] = "lower";
    TransformFunction["TRIM"] = "trim";
    TransformFunction["CONCAT"] = "concat";
    TransformFunction["SPLIT"] = "split";
    TransformFunction["DATE_FORMAT"] = "dateFormat";
    TransformFunction["MATH_OPERATION"] = "mathOperation";
    TransformFunction["CONDITIONAL"] = "conditional";
    TransformFunction["CUSTOM"] = "custom";
})(TransformFunction || (TransformFunction = {}));
export class TransformEngine {
    /**
     * 데이터에 변환 규칙을 적용합니다.
     */
    transform(data, transformations) {
        if (data.length === 0) {
            return [];
        }
        const enabledTransformations = transformations.filter(t => t.enabled !== false);
        if (enabledTransformations.length === 0) {
            return data;
        }
        return data.map(item => {
            const transformedItem = { ...item };
            enabledTransformations.forEach(transformation => {
                this.applyTransformation(transformedItem, transformation);
            });
            return transformedItem;
        });
    }
    /**
     * 개별 아이템에 변환 규칙을 적용합니다.
     */
    applyTransformation(item, transformation) {
        const sourceValue = this.getFieldValue(item, transformation.sourceField);
        let transformedValue;
        switch (transformation.function) {
            case TransformFunction.RENAME:
                transformedValue = sourceValue;
                break;
            case TransformFunction.CAST:
                transformedValue = this.castValue(sourceValue, transformation.parameters?.targetType);
                break;
            case TransformFunction.SUBSTRING:
                transformedValue = this.substring(sourceValue, transformation.parameters);
                break;
            case TransformFunction.REPLACE:
                transformedValue = this.replace(sourceValue, transformation.parameters);
                break;
            case TransformFunction.UPPER:
                transformedValue = String(sourceValue).toUpperCase();
                break;
            case TransformFunction.LOWER:
                transformedValue = String(sourceValue).toLowerCase();
                break;
            case TransformFunction.TRIM:
                transformedValue = String(sourceValue).trim();
                break;
            case TransformFunction.CONCAT:
                transformedValue = this.concat(item, transformation.parameters);
                break;
            case TransformFunction.SPLIT:
                transformedValue = this.split(sourceValue, transformation.parameters);
                break;
            case TransformFunction.DATE_FORMAT:
                transformedValue = this.formatDate(sourceValue, transformation.parameters);
                break;
            case TransformFunction.MATH_OPERATION:
                transformedValue = this.mathOperation(sourceValue, transformation.parameters);
                break;
            case TransformFunction.CONDITIONAL:
                transformedValue = this.conditional(item, transformation.parameters);
                break;
            case TransformFunction.CUSTOM:
                transformedValue = this.customFunction(sourceValue, transformation.parameters);
                break;
            default:
                throw new Error(`Unsupported transformation function: ${transformation.function}`);
        }
        this.setFieldValue(item, transformation.targetField, transformedValue);
    }
    /**
     * 값을 지정된 타입으로 캐스팅합니다.
     */
    castValue(value, targetType) {
        if (value === null || value === undefined) {
            return value;
        }
        switch (targetType) {
            case 'string':
                return String(value);
            case 'number':
                const num = Number(value);
                return isNaN(num) ? null : num;
            case 'boolean':
                if (typeof value === 'boolean')
                    return value;
                if (typeof value === 'string') {
                    const lower = value.toLowerCase();
                    return lower === 'true' || lower === '1' || lower === 'yes';
                }
                return Boolean(value);
            case 'date':
                const date = new Date(value);
                return isNaN(date.getTime()) ? null : date;
            default:
                return value;
        }
    }
    /**
     * 문자열 부분 추출
     */
    substring(value, params) {
        const str = String(value);
        const start = params?.start || 0;
        const length = params?.length;
        if (length !== undefined) {
            return str.substring(start, start + length);
        }
        return str.substring(start, params?.end);
    }
    /**
     * 문자열 치환
     */
    replace(value, params) {
        const str = String(value);
        const searchValue = params?.search || '';
        const replaceValue = params?.replace || '';
        const isRegex = params?.isRegex || false;
        const flags = params?.flags || 'g';
        if (isRegex) {
            const regex = new RegExp(searchValue, flags);
            return str.replace(regex, replaceValue);
        }
        return str.replace(new RegExp(searchValue, 'g'), replaceValue);
    }
    /**
     * 문자열 연결
     */
    concat(item, params) {
        const fields = params?.fields || [];
        const separator = params?.separator || '';
        const values = fields.map((field) => {
            const value = this.getFieldValue(item, field);
            return value !== null && value !== undefined ? String(value) : '';
        });
        return values.join(separator);
    }
    /**
     * 문자열 분할
     */
    split(value, params) {
        const str = String(value);
        const delimiter = params?.delimiter || ',';
        const limit = params?.limit;
        if (limit !== undefined) {
            return str.split(delimiter, limit);
        }
        return str.split(delimiter);
    }
    /**
     * 날짜 포맷팅
     */
    formatDate(value, params) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return String(value);
        }
        const format = params?.format || 'YYYY-MM-DD';
        // 간단한 날짜 포맷팅 (실제로는 더 복잡한 라이브러리 사용 권장)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return format
            .replace('YYYY', String(year))
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
    /**
     * 수학 연산
     */
    mathOperation(value, params) {
        const num = Number(value);
        if (isNaN(num)) {
            throw new Error(`Cannot perform math operation on non-numeric value: ${value}`);
        }
        const operation = params?.operation;
        const operand = Number(params?.operand);
        if (isNaN(operand)) {
            throw new Error(`Invalid operand for math operation: ${params?.operand}`);
        }
        switch (operation) {
            case 'add':
                return num + operand;
            case 'subtract':
                return num - operand;
            case 'multiply':
                return num * operand;
            case 'divide':
                if (operand === 0) {
                    throw new Error('Division by zero');
                }
                return num / operand;
            case 'modulo':
                return num % operand;
            case 'power':
                return Math.pow(num, operand);
            default:
                throw new Error(`Unsupported math operation: ${operation}`);
        }
    }
    /**
     * 조건부 변환
     */
    conditional(item, params) {
        const condition = params?.condition;
        const trueValue = params?.trueValue;
        const falseValue = params?.falseValue;
        if (!condition) {
            throw new Error('Conditional transformation requires a condition');
        }
        const result = this.evaluateCondition(item, condition);
        return result ? trueValue : falseValue;
    }
    /**
     * 조건 평가
     */
    evaluateCondition(item, condition) {
        const field = condition.field;
        const operator = condition.operator;
        const value = condition.value;
        const fieldValue = this.getFieldValue(item, field);
        switch (operator) {
            case '==':
                return fieldValue == value;
            case '===':
                return fieldValue === value;
            case '!=':
                return fieldValue != value;
            case '!==':
                return fieldValue !== value;
            case '>':
                return fieldValue > value;
            case '>=':
                return fieldValue >= value;
            case '<':
                return fieldValue < value;
            case '<=':
                return fieldValue <= value;
            default:
                throw new Error(`Unsupported condition operator: ${operator}`);
        }
    }
    /**
     * 커스텀 함수 실행
     */
    customFunction(value, params) {
        const functionCode = params?.function;
        if (!functionCode) {
            throw new Error('Custom function requires function code');
        }
        try {
            // 보안상 위험할 수 있으므로 실제 환경에서는 더 안전한 방법 사용 권장
            const func = new Function('value', 'params', functionCode);
            return func(value, params);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Error executing custom function: ${errorMessage}`);
        }
    }
    /**
     * 객체에서 필드 값을 가져옵니다.
     */
    getFieldValue(item, fieldPath) {
        const parts = fieldPath.split('.');
        let value = item;
        for (const part of parts) {
            if (value === null || value === undefined) {
                return undefined;
            }
            value = value[part];
        }
        return value;
    }
    /**
     * 객체의 필드 값을 설정합니다.
     */
    setFieldValue(item, fieldPath, value) {
        const parts = fieldPath.split('.');
        let current = item;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current[part] === undefined) {
                current[part] = {};
            }
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    }
}
