
import { AbstractParseTreeVisitor } from "antlr4ng";


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `SerParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class SerVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `SerParser.ruleFile`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRuleFile?: (ctx: RuleFileContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.traceFile`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTraceFile?: (ctx: TraceFileContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.ruleDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRuleDecl?: (ctx: RuleDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.traceDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTraceDecl?: (ctx: TraceDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.endpointDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEndpointDecl?: (ctx: EndpointDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.factDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFactDecl?: (ctx: FactDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.ruleTargetDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRuleTargetDecl?: (ctx: RuleTargetDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.findDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFindDecl?: (ctx: FindDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.letDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLetDecl?: (ctx: LetDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.sourceLine`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSourceLine?: (ctx: SourceLineContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.sourceExpr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSourceExpr?: (ctx: SourceExprContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.takeExpr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTakeExpr?: (ctx: TakeExprContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.defaultLine`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDefaultLine?: (ctx: DefaultLineContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.mapBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMapBlock?: (ctx: MapBlockContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.mapEntry`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMapEntry?: (ctx: MapEntryContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.buildDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBuildDecl?: (ctx: BuildDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.buildField`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBuildField?: (ctx: BuildFieldContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.buildFieldName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBuildFieldName?: (ctx: BuildFieldNameContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.traceEntry`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTraceEntry?: (ctx: TraceEntryContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.whenDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhenDecl?: (ctx: WhenDeclContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.traceTarget`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTraceTarget?: (ctx: TraceTargetContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.buildExpr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBuildExpr?: (ctx: BuildExprContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.concatList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConcatList?: (ctx: ConcatListContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.concatItem`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitConcatItem?: (ctx: ConcatItemContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.pipelineStep`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPipelineStep?: (ctx: PipelineStepContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.methodPattern`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodPattern?: (ctx: MethodPatternContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.qualifiedName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitQualifiedName?: (ctx: QualifiedNameContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.annotationRef`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAnnotationRef?: (ctx: AnnotationRefContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.decoratorRef`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDecoratorRef?: (ctx: DecoratorRefContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.elementRef`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElementRef?: (ctx: ElementRefContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.identList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIdentList?: (ctx: IdentListContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.findName`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFindName?: (ctx: FindNameContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.nameItem`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNameItem?: (ctx: NameItemContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.literal`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLiteral?: (ctx: LiteralContext) => Result;
    /**
     * Visit a parse tree produced by `SerParser.valueToken`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitValueToken?: (ctx: ValueTokenContext) => Result;
}

