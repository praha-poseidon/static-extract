
import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { RuleFileContext } from "./SerParser.js";
import { TraceFileContext } from "./SerParser.js";
import { RuleDeclContext } from "./SerParser.js";
import { TraceDeclContext } from "./SerParser.js";
import { EndpointDeclContext } from "./SerParser.js";
import { FactDeclContext } from "./SerParser.js";
import { RuleTargetDeclContext } from "./SerParser.js";
import { FindDeclContext } from "./SerParser.js";
import { LetDeclContext } from "./SerParser.js";
import { SourceLineContext } from "./SerParser.js";
import { SourceExprContext } from "./SerParser.js";
import { TakeExprContext } from "./SerParser.js";
import { DefaultLineContext } from "./SerParser.js";
import { MapBlockContext } from "./SerParser.js";
import { MapEntryContext } from "./SerParser.js";
import { BuildDeclContext } from "./SerParser.js";
import { BuildFieldContext } from "./SerParser.js";
import { BuildFieldNameContext } from "./SerParser.js";
import { TraceEntryContext } from "./SerParser.js";
import { WhenDeclContext } from "./SerParser.js";
import { TraceTargetContext } from "./SerParser.js";
import { BuildExprContext } from "./SerParser.js";
import { ConcatListContext } from "./SerParser.js";
import { ConcatItemContext } from "./SerParser.js";
import { PipelineStepContext } from "./SerParser.js";
import { MethodPatternContext } from "./SerParser.js";
import { QualifiedNameContext } from "./SerParser.js";
import { AnnotationRefContext } from "./SerParser.js";
import { DecoratorRefContext } from "./SerParser.js";
import { ElementRefContext } from "./SerParser.js";
import { IdentListContext } from "./SerParser.js";
import { FindNameContext } from "./SerParser.js";
import { NameItemContext } from "./SerParser.js";
import { LiteralContext } from "./SerParser.js";
import { ValueTokenContext } from "./SerParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `SerParser`.
 */
export class SerListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `SerParser.ruleFile`.
     * @param ctx the parse tree
     */
    enterRuleFile?: (ctx: RuleFileContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.ruleFile`.
     * @param ctx the parse tree
     */
    exitRuleFile?: (ctx: RuleFileContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.traceFile`.
     * @param ctx the parse tree
     */
    enterTraceFile?: (ctx: TraceFileContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.traceFile`.
     * @param ctx the parse tree
     */
    exitTraceFile?: (ctx: TraceFileContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.ruleDecl`.
     * @param ctx the parse tree
     */
    enterRuleDecl?: (ctx: RuleDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.ruleDecl`.
     * @param ctx the parse tree
     */
    exitRuleDecl?: (ctx: RuleDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.traceDecl`.
     * @param ctx the parse tree
     */
    enterTraceDecl?: (ctx: TraceDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.traceDecl`.
     * @param ctx the parse tree
     */
    exitTraceDecl?: (ctx: TraceDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.endpointDecl`.
     * @param ctx the parse tree
     */
    enterEndpointDecl?: (ctx: EndpointDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.endpointDecl`.
     * @param ctx the parse tree
     */
    exitEndpointDecl?: (ctx: EndpointDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.factDecl`.
     * @param ctx the parse tree
     */
    enterFactDecl?: (ctx: FactDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.factDecl`.
     * @param ctx the parse tree
     */
    exitFactDecl?: (ctx: FactDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.ruleTargetDecl`.
     * @param ctx the parse tree
     */
    enterRuleTargetDecl?: (ctx: RuleTargetDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.ruleTargetDecl`.
     * @param ctx the parse tree
     */
    exitRuleTargetDecl?: (ctx: RuleTargetDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.findDecl`.
     * @param ctx the parse tree
     */
    enterFindDecl?: (ctx: FindDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.findDecl`.
     * @param ctx the parse tree
     */
    exitFindDecl?: (ctx: FindDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.letDecl`.
     * @param ctx the parse tree
     */
    enterLetDecl?: (ctx: LetDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.letDecl`.
     * @param ctx the parse tree
     */
    exitLetDecl?: (ctx: LetDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.sourceLine`.
     * @param ctx the parse tree
     */
    enterSourceLine?: (ctx: SourceLineContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.sourceLine`.
     * @param ctx the parse tree
     */
    exitSourceLine?: (ctx: SourceLineContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.sourceExpr`.
     * @param ctx the parse tree
     */
    enterSourceExpr?: (ctx: SourceExprContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.sourceExpr`.
     * @param ctx the parse tree
     */
    exitSourceExpr?: (ctx: SourceExprContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.takeExpr`.
     * @param ctx the parse tree
     */
    enterTakeExpr?: (ctx: TakeExprContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.takeExpr`.
     * @param ctx the parse tree
     */
    exitTakeExpr?: (ctx: TakeExprContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.defaultLine`.
     * @param ctx the parse tree
     */
    enterDefaultLine?: (ctx: DefaultLineContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.defaultLine`.
     * @param ctx the parse tree
     */
    exitDefaultLine?: (ctx: DefaultLineContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.mapBlock`.
     * @param ctx the parse tree
     */
    enterMapBlock?: (ctx: MapBlockContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.mapBlock`.
     * @param ctx the parse tree
     */
    exitMapBlock?: (ctx: MapBlockContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.mapEntry`.
     * @param ctx the parse tree
     */
    enterMapEntry?: (ctx: MapEntryContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.mapEntry`.
     * @param ctx the parse tree
     */
    exitMapEntry?: (ctx: MapEntryContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.buildDecl`.
     * @param ctx the parse tree
     */
    enterBuildDecl?: (ctx: BuildDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.buildDecl`.
     * @param ctx the parse tree
     */
    exitBuildDecl?: (ctx: BuildDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.buildField`.
     * @param ctx the parse tree
     */
    enterBuildField?: (ctx: BuildFieldContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.buildField`.
     * @param ctx the parse tree
     */
    exitBuildField?: (ctx: BuildFieldContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.buildFieldName`.
     * @param ctx the parse tree
     */
    enterBuildFieldName?: (ctx: BuildFieldNameContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.buildFieldName`.
     * @param ctx the parse tree
     */
    exitBuildFieldName?: (ctx: BuildFieldNameContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.traceEntry`.
     * @param ctx the parse tree
     */
    enterTraceEntry?: (ctx: TraceEntryContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.traceEntry`.
     * @param ctx the parse tree
     */
    exitTraceEntry?: (ctx: TraceEntryContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.whenDecl`.
     * @param ctx the parse tree
     */
    enterWhenDecl?: (ctx: WhenDeclContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.whenDecl`.
     * @param ctx the parse tree
     */
    exitWhenDecl?: (ctx: WhenDeclContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.traceTarget`.
     * @param ctx the parse tree
     */
    enterTraceTarget?: (ctx: TraceTargetContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.traceTarget`.
     * @param ctx the parse tree
     */
    exitTraceTarget?: (ctx: TraceTargetContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.buildExpr`.
     * @param ctx the parse tree
     */
    enterBuildExpr?: (ctx: BuildExprContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.buildExpr`.
     * @param ctx the parse tree
     */
    exitBuildExpr?: (ctx: BuildExprContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.concatList`.
     * @param ctx the parse tree
     */
    enterConcatList?: (ctx: ConcatListContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.concatList`.
     * @param ctx the parse tree
     */
    exitConcatList?: (ctx: ConcatListContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.concatItem`.
     * @param ctx the parse tree
     */
    enterConcatItem?: (ctx: ConcatItemContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.concatItem`.
     * @param ctx the parse tree
     */
    exitConcatItem?: (ctx: ConcatItemContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.pipelineStep`.
     * @param ctx the parse tree
     */
    enterPipelineStep?: (ctx: PipelineStepContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.pipelineStep`.
     * @param ctx the parse tree
     */
    exitPipelineStep?: (ctx: PipelineStepContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.methodPattern`.
     * @param ctx the parse tree
     */
    enterMethodPattern?: (ctx: MethodPatternContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.methodPattern`.
     * @param ctx the parse tree
     */
    exitMethodPattern?: (ctx: MethodPatternContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.qualifiedName`.
     * @param ctx the parse tree
     */
    enterQualifiedName?: (ctx: QualifiedNameContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.qualifiedName`.
     * @param ctx the parse tree
     */
    exitQualifiedName?: (ctx: QualifiedNameContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.annotationRef`.
     * @param ctx the parse tree
     */
    enterAnnotationRef?: (ctx: AnnotationRefContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.annotationRef`.
     * @param ctx the parse tree
     */
    exitAnnotationRef?: (ctx: AnnotationRefContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.decoratorRef`.
     * @param ctx the parse tree
     */
    enterDecoratorRef?: (ctx: DecoratorRefContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.decoratorRef`.
     * @param ctx the parse tree
     */
    exitDecoratorRef?: (ctx: DecoratorRefContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.elementRef`.
     * @param ctx the parse tree
     */
    enterElementRef?: (ctx: ElementRefContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.elementRef`.
     * @param ctx the parse tree
     */
    exitElementRef?: (ctx: ElementRefContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.identList`.
     * @param ctx the parse tree
     */
    enterIdentList?: (ctx: IdentListContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.identList`.
     * @param ctx the parse tree
     */
    exitIdentList?: (ctx: IdentListContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.findName`.
     * @param ctx the parse tree
     */
    enterFindName?: (ctx: FindNameContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.findName`.
     * @param ctx the parse tree
     */
    exitFindName?: (ctx: FindNameContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.nameItem`.
     * @param ctx the parse tree
     */
    enterNameItem?: (ctx: NameItemContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.nameItem`.
     * @param ctx the parse tree
     */
    exitNameItem?: (ctx: NameItemContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.literal`.
     * @param ctx the parse tree
     */
    enterLiteral?: (ctx: LiteralContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.literal`.
     * @param ctx the parse tree
     */
    exitLiteral?: (ctx: LiteralContext) => void;
    /**
     * Enter a parse tree produced by `SerParser.valueToken`.
     * @param ctx the parse tree
     */
    enterValueToken?: (ctx: ValueTokenContext) => void;
    /**
     * Exit a parse tree produced by `SerParser.valueToken`.
     * @param ctx the parse tree
     */
    exitValueToken?: (ctx: ValueTokenContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

