var AggregateFunction;
(function (AggregateFunction) {
    AggregateFunction["COUNT"] = "count";
    AggregateFunction["SUM"] = "sum";
    AggregateFunction["AVG"] = "avg";
    AggregateFunction["MIN"] = "min";
    AggregateFunction["MAX"] = "max";
    AggregateFunction["FIRST"] = "first";
    AggregateFunction["LAST"] = "last";
    AggregateFunction["STDDEV"] = "stddev";
    AggregateFunction["VARIANCE"] = "variance";
})(AggregateFunction || (AggregateFunction = {}));
export class AggregateEngine {
    /**
     * 데이터에 집계 규칙을 적용합니다.
     */
    aggregate(data, groupBy, aggregations, orderBy) {
        if (data.length === 0) {
            return [];
        }
        const enabledAggregations = aggregations.filter(a => a.enabled !== false);
        if (enabledAggregations.length === 0) {
            return data;
        }
        // 그룹화
        const groups = this.groupData(data, groupBy);
        // 각 그룹에 대해 집계 수행
        const aggregatedData = groups.map(group => {
            const result = {};
            // 그룹 키 추가
            groupBy.forEach(field => {
                result[field] = group.key[field];
            });
            // 집계 함수 적용
            enabledAggregations.forEach(agg => {
                const fieldName = agg.alias || `${agg.function}_${agg.field}`;
                result[fieldName] = this.applyAggregation(group.items, agg);
            });
            return result;
        });
        // 정렬
        if (orderBy && orderBy.length > 0) {
            return this.sortData(aggregatedData, orderBy);
        }
        return aggregatedData;
    }
    /**
     * 데이터를 그룹화합니다.
     */
    groupData(data, groupBy) {
        if (groupBy.length === 0) {
            // 그룹화 없이 전체 데이터를 하나의 그룹으로 처리
            return [{ key: {}, items: data }];
        }
        const groups = new Map();
        data.forEach(item => {
            const key = {};
            groupBy.forEach(field => {
                key[field] = this.getFieldValue(item, field);
            });
            const keyString = JSON.stringify(key);
            if (!groups.has(keyString)) {
                groups.set(keyString, { key, items: [] });
            }
            groups.get(keyString).items.push(item);
        });
        return Array.from(groups.values());
    }
    /**
     * 개별 그룹에 집계 함수를 적용합니다.
     */
    applyAggregation(items, aggregation) {
        let values = items.map(item => this.getFieldValue(item, aggregation.field));
        // null/undefined 값 제거
        values = values.filter(val => val !== null && val !== undefined);
        // distinct 처리
        if (aggregation.distinct) {
            values = [...new Set(values)];
        }
        switch (aggregation.function) {
            case AggregateFunction.COUNT:
                return aggregation.field === '*' ? items.length : values.length;
            case AggregateFunction.SUM:
                return values.reduce((sum, val) => {
                    const num = Number(val);
                    return isNaN(num) ? sum : sum + num;
                }, 0);
            case AggregateFunction.AVG:
                if (values.length === 0)
                    return null;
                const sum = values.reduce((sum, val) => {
                    const num = Number(val);
                    return isNaN(num) ? sum : sum + num;
                }, 0);
                return sum / values.length;
            case AggregateFunction.MIN:
                if (values.length === 0)
                    return null;
                return values.reduce((min, val) => {
                    const num = Number(val);
                    return isNaN(num) ? min : Math.min(min, num);
                }, Number.MAX_VALUE);
            case AggregateFunction.MAX:
                if (values.length === 0)
                    return null;
                return values.reduce((max, val) => {
                    const num = Number(val);
                    return isNaN(num) ? max : Math.max(max, num);
                }, Number.MIN_VALUE);
            case AggregateFunction.FIRST:
                return values.length > 0 ? values[0] : null;
            case AggregateFunction.LAST:
                return values.length > 0 ? values[values.length - 1] : null;
            case AggregateFunction.STDDEV:
                return this.calculateStandardDeviation(values);
            case AggregateFunction.VARIANCE:
                return this.calculateVariance(values);
            default:
                throw new Error(`Unsupported aggregation function: ${aggregation.function}`);
        }
    }
    /**
     * 표준편차를 계산합니다.
     */
    calculateStandardDeviation(values) {
        if (values.length === 0)
            return null;
        const numbers = values.map(val => Number(val)).filter(num => !isNaN(num));
        if (numbers.length === 0)
            return null;
        const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
        return Math.sqrt(variance);
    }
    /**
     * 분산을 계산합니다.
     */
    calculateVariance(values) {
        if (values.length === 0)
            return null;
        const numbers = values.map(val => Number(val)).filter(num => !isNaN(num));
        if (numbers.length === 0)
            return null;
        const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        return numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    }
    /**
     * 데이터를 정렬합니다.
     */
    sortData(data, orderBy) {
        return data.sort((a, b) => {
            for (const rule of orderBy) {
                const aVal = this.getFieldValue(a, rule.field);
                const bVal = this.getFieldValue(b, rule.field);
                let comparison = 0;
                if (aVal < bVal)
                    comparison = -1;
                else if (aVal > bVal)
                    comparison = 1;
                if (comparison !== 0) {
                    return rule.direction === 'ASC' ? comparison : -comparison;
                }
            }
            return 0;
        });
    }
    /**
     * 객체에서 필드 값을 가져옵니다.
     */
    getFieldValue(item, fieldPath) {
        if (fieldPath === '*')
            return item;
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
}
