import { BaseNode, NodeType, NodeValidationResult, ValidationError, ValidationWarning, Diagram } from '@diagram/common';
export declare function validateNode(node: BaseNode): NodeValidationResult;
export declare function validateDiagram(diagram: Diagram): {
    isValid: boolean;
    nodeResults: NodeValidationResult[];
    diagramErrors: ValidationError[];
    diagramWarnings: ValidationWarning[];
};
export declare function validateNodeInputs(nodeType: NodeType, inputCount: number): boolean;
export declare function validateNodeOutputs(nodeType: NodeType, outputCount: number): boolean;
//# sourceMappingURL=nodeValidation.d.ts.map