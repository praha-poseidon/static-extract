
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { SerListener } from "./SerListener.js";
import { SerVisitor } from "./SerVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class SerParser extends antlr.Parser {
    public static readonly RULE = 1;
    public static readonly TRACE = 2;
    public static readonly ENDPOINT = 3;
    public static readonly FACT = 4;
    public static readonly FIND = 5;
    public static readonly WITH = 6;
    public static readonly LET = 7;
    public static readonly FROM = 8;
    public static readonly ON = 9;
    public static readonly TAKE = 10;
    public static readonly DEFAULT = 11;
    public static readonly MAP = 12;
    public static readonly BUILD = 13;
    public static readonly EXTERNAL = 14;
    public static readonly WHEN = 15;
    public static readonly KEY = 16;
    public static readonly RESOLVE = 17;
    public static readonly ANNOTATION = 18;
    public static readonly DECORATOR = 19;
    public static readonly ARGUMENT = 20;
    public static readonly METHOD = 21;
    public static readonly CLASS = 22;
    public static readonly FIELD = 23;
    public static readonly CALL = 24;
    public static readonly PARAMETER = 25;
    public static readonly RETURN = 26;
    public static readonly ASSIGNMENT = 27;
    public static readonly NEW = 28;
    public static readonly LITERAL = 29;
    public static readonly NAME = 30;
    public static readonly VALUE = 31;
    public static readonly RAW = 32;
    public static readonly TYPE = 33;
    public static readonly OWNER = 34;
    public static readonly SIGNATURE = 35;
    public static readonly ATTR = 36;
    public static readonly CONCAT = 37;
    public static readonly NORMALIZE = 38;
    public static readonly REGEX = 39;
    public static readonly REPLACE = 40;
    public static readonly GROUP = 41;
    public static readonly PLAIN = 42;
    public static readonly PLACEHOLDER = 43;
    public static readonly EQ = 44;
    public static readonly COLON = 45;
    public static readonly COMMA = 46;
    public static readonly DOT = 47;
    public static readonly PIPE = 48;
    public static readonly AT = 49;
    public static readonly STAR = 50;
    public static readonly LBRACE = 51;
    public static readonly RBRACE = 52;
    public static readonly LBRACK = 53;
    public static readonly RBRACK = 54;
    public static readonly LPAREN = 55;
    public static readonly RPAREN = 56;
    public static readonly STRING = 57;
    public static readonly IDENT = 58;
    public static readonly INT = 59;
    public static readonly LINE_COMMENT = 60;
    public static readonly WS = 61;
    public static readonly RULE_ruleFile = 0;
    public static readonly RULE_traceFile = 1;
    public static readonly RULE_ruleDecl = 2;
    public static readonly RULE_traceDecl = 3;
    public static readonly RULE_endpointDecl = 4;
    public static readonly RULE_factDecl = 5;
    public static readonly RULE_ruleTargetDecl = 6;
    public static readonly RULE_findDecl = 7;
    public static readonly RULE_letDecl = 8;
    public static readonly RULE_sourceLine = 9;
    public static readonly RULE_sourceExpr = 10;
    public static readonly RULE_takeExpr = 11;
    public static readonly RULE_defaultLine = 12;
    public static readonly RULE_mapBlock = 13;
    public static readonly RULE_mapEntry = 14;
    public static readonly RULE_buildDecl = 15;
    public static readonly RULE_buildField = 16;
    public static readonly RULE_buildFieldName = 17;
    public static readonly RULE_traceEntry = 18;
    public static readonly RULE_whenDecl = 19;
    public static readonly RULE_traceTarget = 20;
    public static readonly RULE_buildExpr = 21;
    public static readonly RULE_concatList = 22;
    public static readonly RULE_concatItem = 23;
    public static readonly RULE_pipelineStep = 24;
    public static readonly RULE_methodPattern = 25;
    public static readonly RULE_qualifiedName = 26;
    public static readonly RULE_annotationRef = 27;
    public static readonly RULE_decoratorRef = 28;
    public static readonly RULE_elementRef = 29;
    public static readonly RULE_identList = 30;
    public static readonly RULE_findName = 31;
    public static readonly RULE_nameItem = 32;
    public static readonly RULE_literal = 33;
    public static readonly RULE_valueToken = 34;

    public static readonly literalNames = [
        null, "'rule'", "'trace'", "'endpoint'", "'fact'", "'find'", "'with'",
        "'let'", "'from'", "'on'", "'take'", "'default'", "'map'", "'build'",
        "'external'", "'when'", "'key'", "'resolve'", "'annotation'", "'decorator'",
        "'argument'", "'method'", "'class'", "'field'", "'call'", "'parameter'",
        "'return'", "'assignment'", "'new'", "'literal'", "'name'", "'value'",
        "'raw'", "'type'", "'owner'", "'signature'", "'attr'", "'concat'",
        "'normalize'", "'regex'", "'replace'", "'group'", "'plain'", "'placeholder'",
        "'='", "':'", "','", "'.'", "'|'", "'@'", "'*'", "'{'", "'}'", "'['",
        "']'", "'('", "')'"
    ];

    public static readonly symbolicNames = [
        null, "RULE", "TRACE", "ENDPOINT", "FACT", "FIND", "WITH", "LET",
        "FROM", "ON", "TAKE", "DEFAULT", "MAP", "BUILD", "EXTERNAL", "WHEN",
        "KEY", "RESOLVE", "ANNOTATION", "DECORATOR", "ARGUMENT", "METHOD",
        "CLASS", "FIELD", "CALL", "PARAMETER", "RETURN", "ASSIGNMENT", "NEW",
        "LITERAL", "NAME", "VALUE", "RAW", "TYPE", "OWNER", "SIGNATURE",
        "ATTR", "CONCAT", "NORMALIZE", "REGEX", "REPLACE", "GROUP", "PLAIN",
        "PLACEHOLDER", "EQ", "COLON", "COMMA", "DOT", "PIPE", "AT", "STAR",
        "LBRACE", "RBRACE", "LBRACK", "RBRACK", "LPAREN", "RPAREN", "STRING",
        "IDENT", "INT", "LINE_COMMENT", "WS"
    ];
    public static readonly ruleNames = [
        "ruleFile", "traceFile", "ruleDecl", "traceDecl", "endpointDecl",
        "factDecl", "ruleTargetDecl", "findDecl", "letDecl", "sourceLine",
        "sourceExpr", "takeExpr", "defaultLine", "mapBlock", "mapEntry",
        "buildDecl", "buildField", "buildFieldName", "traceEntry", "whenDecl",
        "traceTarget", "buildExpr", "concatList", "concatItem", "pipelineStep",
        "methodPattern", "qualifiedName", "annotationRef", "decoratorRef",
        "elementRef", "identList", "findName", "nameItem", "literal", "valueToken",
    ];

    public get grammarFileName(): string { return "Ser.g4"; }
    public get literalNames(): (string | null)[] { return SerParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return SerParser.symbolicNames; }
    public get ruleNames(): string[] { return SerParser.ruleNames; }
    public get serializedATN(): number[] { return SerParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, SerParser._ATN, SerParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public ruleFile(): RuleFileContext {
        let localContext = new RuleFileContext(this.context, this.state);
        this.enterRule(localContext, 0, SerParser.RULE_ruleFile);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 70;
            this.ruleDecl();
            this.state = 71;
            this.ruleTargetDecl();
            this.state = 72;
            this.findDecl();
            this.state = 76;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 15) {
                {
                {
                this.state = 73;
                this.whenDecl();
                }
                }
                this.state = 78;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 82;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 7) {
                {
                {
                this.state = 79;
                this.letDecl();
                }
                }
                this.state = 84;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 85;
            this.buildDecl();
            this.state = 86;
            this.match(SerParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public traceFile(): TraceFileContext {
        let localContext = new TraceFileContext(this.context, this.state);
        this.enterRule(localContext, 2, SerParser.RULE_traceFile);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 88;
            this.traceDecl();
            this.state = 92;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 8) {
                {
                {
                this.state = 89;
                this.traceEntry();
                }
                }
                this.state = 94;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 95;
            this.match(SerParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ruleDecl(): RuleDeclContext {
        let localContext = new RuleDeclContext(this.context, this.state);
        this.enterRule(localContext, 4, SerParser.RULE_ruleDecl);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 97;
            this.match(SerParser.RULE);
            this.state = 98;
            this.match(SerParser.STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public traceDecl(): TraceDeclContext {
        let localContext = new TraceDeclContext(this.context, this.state);
        this.enterRule(localContext, 6, SerParser.RULE_traceDecl);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 100;
            this.match(SerParser.TRACE);
            this.state = 101;
            this.match(SerParser.STRING);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public endpointDecl(): EndpointDeclContext {
        let localContext = new EndpointDeclContext(this.context, this.state);
        this.enterRule(localContext, 8, SerParser.RULE_endpointDecl);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 103;
            this.match(SerParser.ENDPOINT);
            this.state = 104;
            this.valueToken();
            this.state = 105;
            this.valueToken();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public factDecl(): FactDeclContext {
        let localContext = new FactDeclContext(this.context, this.state);
        this.enterRule(localContext, 10, SerParser.RULE_factDecl);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 107;
            this.match(SerParser.FACT);
            this.state = 108;
            this.valueToken();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ruleTargetDecl(): RuleTargetDeclContext {
        let localContext = new RuleTargetDeclContext(this.context, this.state);
        this.enterRule(localContext, 12, SerParser.RULE_ruleTargetDecl);
        try {
            this.state = 112;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SerParser.ENDPOINT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 110;
                this.endpointDecl();
                }
                break;
            case SerParser.FACT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 111;
                this.factDecl();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public findDecl(): FindDeclContext {
        let localContext = new FindDeclContext(this.context, this.state);
        this.enterRule(localContext, 14, SerParser.RULE_findDecl);
        let _la: number;
        try {
            this.state = 142;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 114;
                this.match(SerParser.FIND);
                this.state = 115;
                this.match(SerParser.METHOD);
                this.state = 116;
                this.match(SerParser.WITH);
                this.state = 117;
                this.match(SerParser.ANNOTATION);
                this.state = 118;
                this.annotationRef();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 119;
                this.match(SerParser.FIND);
                this.state = 120;
                this.match(SerParser.METHOD);
                this.state = 121;
                this.methodPattern();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 122;
                this.match(SerParser.FIND);
                this.state = 123;
                this.match(SerParser.CLASS);
                this.state = 124;
                this.match(SerParser.WITH);
                this.state = 125;
                this.match(SerParser.ANNOTATION);
                this.state = 126;
                this.annotationRef();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 127;
                this.match(SerParser.FIND);
                this.state = 128;
                this.match(SerParser.CLASS);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 129;
                this.match(SerParser.FIND);
                this.state = 130;
                this.match(SerParser.FIELD);
                this.state = 131;
                this.match(SerParser.WITH);
                this.state = 132;
                this.match(SerParser.ANNOTATION);
                this.state = 133;
                this.annotationRef();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 134;
                this.match(SerParser.FIND);
                this.state = 135;
                this.match(SerParser.FIELD);
                this.state = 136;
                localContext._fieldName = this.nameItem();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 137;
                this.match(SerParser.FIND);
                this.state = 138;
                localContext._genericFindKind = this.nameItem();
                this.state = 140;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 69206031) !== 0)) {
                    {
                    this.state = 139;
                    localContext._genericFindName = this.findName();
                    }
                }

                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public letDecl(): LetDeclContext {
        let localContext = new LetDeclContext(this.context, this.state);
        this.enterRule(localContext, 16, SerParser.RULE_letDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 144;
            this.match(SerParser.LET);
            this.state = 145;
            localContext._letName = this.nameItem();
            this.state = 146;
            this.match(SerParser.EQ);
            this.state = 148;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 147;
                this.sourceLine();
                }
                }
                this.state = 150;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 8);
            this.state = 153;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 11) {
                {
                this.state = 152;
                this.defaultLine();
                }
            }

            this.state = 156;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 12) {
                {
                this.state = 155;
                this.mapBlock();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sourceLine(): SourceLineContext {
        let localContext = new SourceLineContext(this.context, this.state);
        this.enterRule(localContext, 18, SerParser.RULE_sourceLine);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 158;
            this.match(SerParser.FROM);
            this.state = 159;
            this.sourceExpr();
            this.state = 160;
            this.match(SerParser.TAKE);
            this.state = 161;
            this.takeExpr();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sourceExpr(): SourceExprContext {
        let localContext = new SourceExprContext(this.context, this.state);
        this.enterRule(localContext, 20, SerParser.RULE_sourceExpr);
        let _la: number;
        try {
            this.state = 199;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 12, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 163;
                this.match(SerParser.ANNOTATION);
                this.state = 164;
                this.match(SerParser.ON);
                this.state = 165;
                this.elementRef();
                this.state = 166;
                this.annotationRef();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 168;
                this.match(SerParser.DECORATOR);
                this.state = 169;
                this.match(SerParser.ON);
                this.state = 170;
                this.elementRef();
                this.state = 171;
                this.decoratorRef();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 173;
                this.match(SerParser.ARGUMENT);
                this.state = 174;
                this.match(SerParser.LBRACK);
                this.state = 175;
                this.match(SerParser.INT);
                this.state = 176;
                this.match(SerParser.RBRACK);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 177;
                this.match(SerParser.CALL);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 178;
                this.match(SerParser.DECORATOR);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 179;
                this.match(SerParser.METHOD);
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 180;
                this.match(SerParser.CLASS);
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 181;
                this.match(SerParser.FIELD);
                this.state = 183;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 67108879) !== 0)) {
                    {
                    this.state = 182;
                    localContext._sourceName = this.nameItem();
                    }
                }

                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 185;
                this.match(SerParser.PARAMETER);
                this.state = 187;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 67108879) !== 0)) {
                    {
                    this.state = 186;
                    localContext._sourceName = this.nameItem();
                    }
                }

                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 189;
                this.match(SerParser.RETURN);
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 190;
                this.match(SerParser.ASSIGNMENT);
                }
                break;
            case 12:
                this.enterOuterAlt(localContext, 12);
                {
                this.state = 191;
                this.match(SerParser.NEW);
                this.state = 192;
                this.qualifiedName();
                }
                break;
            case 13:
                this.enterOuterAlt(localContext, 13);
                {
                this.state = 193;
                this.match(SerParser.LITERAL);
                this.state = 194;
                this.literal();
                }
                break;
            case 14:
                this.enterOuterAlt(localContext, 14);
                {
                this.state = 195;
                localContext._genericSourceKind = this.nameItem();
                this.state = 197;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 67108879) !== 0)) {
                    {
                    this.state = 196;
                    localContext._genericSourceName = this.nameItem();
                    }
                }

                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public takeExpr(): TakeExprContext {
        let localContext = new TakeExprContext(this.context, this.state);
        this.enterRule(localContext, 22, SerParser.RULE_takeExpr);
        try {
            this.state = 213;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 13, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 201;
                this.match(SerParser.NAME);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 202;
                this.match(SerParser.VALUE);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 203;
                this.match(SerParser.RAW);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 204;
                this.match(SerParser.TYPE);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 205;
                this.match(SerParser.OWNER);
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 206;
                this.match(SerParser.SIGNATURE);
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 207;
                this.match(SerParser.ATTR);
                this.state = 208;
                this.match(SerParser.LPAREN);
                this.state = 209;
                this.identList();
                this.state = 210;
                this.match(SerParser.RPAREN);
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 212;
                localContext._genericTake = this.nameItem();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public defaultLine(): DefaultLineContext {
        let localContext = new DefaultLineContext(this.context, this.state);
        this.enterRule(localContext, 24, SerParser.RULE_defaultLine);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 215;
            this.match(SerParser.DEFAULT);
            this.state = 216;
            this.literal();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public mapBlock(): MapBlockContext {
        let localContext = new MapBlockContext(this.context, this.state);
        this.enterRule(localContext, 26, SerParser.RULE_mapBlock);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 218;
            this.match(SerParser.MAP);
            this.state = 219;
            this.match(SerParser.LBRACE);
            this.state = 223;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 58) {
                {
                {
                this.state = 220;
                this.mapEntry();
                }
                }
                this.state = 225;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 226;
            this.match(SerParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public mapEntry(): MapEntryContext {
        let localContext = new MapEntryContext(this.context, this.state);
        this.enterRule(localContext, 28, SerParser.RULE_mapEntry);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 228;
            this.valueToken();
            this.state = 229;
            this.match(SerParser.COLON);
            this.state = 230;
            this.valueToken();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public buildDecl(): BuildDeclContext {
        let localContext = new BuildDeclContext(this.context, this.state);
        this.enterRule(localContext, 30, SerParser.RULE_buildDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 232;
            this.match(SerParser.BUILD);
            this.state = 233;
            this.match(SerParser.LBRACE);
            this.state = 237;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 67108879) !== 0)) {
                {
                {
                this.state = 234;
                this.buildField();
                }
                }
                this.state = 239;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 240;
            this.match(SerParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public buildField(): BuildFieldContext {
        let localContext = new BuildFieldContext(this.context, this.state);
        this.enterRule(localContext, 32, SerParser.RULE_buildField);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 242;
            this.buildFieldName();
            this.state = 243;
            this.match(SerParser.COLON);
            this.state = 244;
            this.buildExpr();
            this.state = 248;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 48) {
                {
                {
                this.state = 245;
                this.pipelineStep();
                }
                }
                this.state = 250;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public buildFieldName(): BuildFieldNameContext {
        let localContext = new BuildFieldNameContext(this.context, this.state);
        this.enterRule(localContext, 34, SerParser.RULE_buildFieldName);
        try {
            this.state = 256;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 251;
                this.nameItem();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 252;
                this.match(SerParser.KEY);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 253;
                this.match(SerParser.DEFAULT);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 254;
                this.match(SerParser.OWNER);
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 255;
                this.match(SerParser.SIGNATURE);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public traceEntry(): TraceEntryContext {
        let localContext = new TraceEntryContext(this.context, this.state);
        this.enterRule(localContext, 36, SerParser.RULE_traceEntry);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 258;
            this.match(SerParser.FROM);
            this.state = 259;
            this.traceTarget();
            this.state = 263;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 15) {
                {
                {
                this.state = 260;
                this.whenDecl();
                }
                }
                this.state = 265;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 269;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 7) {
                {
                {
                this.state = 266;
                this.letDecl();
                }
                }
                this.state = 271;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 272;
            this.buildDecl();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whenDecl(): WhenDeclContext {
        let localContext = new WhenDeclContext(this.context, this.state);
        this.enterRule(localContext, 38, SerParser.RULE_whenDecl);
        try {
            this.state = 318;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 20, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 274;
                this.match(SerParser.WHEN);
                this.state = 275;
                this.match(SerParser.ANNOTATION);
                this.state = 276;
                this.annotationRef();
                this.state = 277;
                this.match(SerParser.ON);
                this.state = 278;
                this.elementRef();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 280;
                this.match(SerParser.WHEN);
                this.state = 281;
                this.match(SerParser.METHOD);
                this.state = 282;
                this.methodPattern();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 283;
                this.match(SerParser.WHEN);
                this.state = 284;
                this.match(SerParser.CALL);
                this.state = 285;
                this.methodPattern();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 286;
                this.match(SerParser.WHEN);
                this.state = 287;
                this.match(SerParser.FIELD);
                this.state = 288;
                this.match(SerParser.NAME);
                this.state = 289;
                this.valueToken();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 290;
                this.match(SerParser.WHEN);
                this.state = 291;
                this.match(SerParser.FIELD);
                this.state = 292;
                this.match(SerParser.TYPE);
                this.state = 293;
                this.qualifiedName();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 294;
                this.match(SerParser.WHEN);
                this.state = 295;
                this.match(SerParser.PARAMETER);
                this.state = 296;
                this.match(SerParser.NAME);
                this.state = 297;
                this.valueToken();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 298;
                this.match(SerParser.WHEN);
                this.state = 299;
                this.match(SerParser.PARAMETER);
                this.state = 300;
                this.match(SerParser.TYPE);
                this.state = 301;
                this.qualifiedName();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 302;
                this.match(SerParser.WHEN);
                this.state = 303;
                this.match(SerParser.METHOD);
                this.state = 304;
                this.match(SerParser.NAME);
                this.state = 305;
                this.valueToken();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 306;
                this.match(SerParser.WHEN);
                this.state = 307;
                this.match(SerParser.CALL);
                this.state = 308;
                this.match(SerParser.NAME);
                this.state = 309;
                this.valueToken();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 310;
                this.match(SerParser.WHEN);
                this.state = 311;
                this.match(SerParser.CALL);
                this.state = 312;
                this.match(SerParser.OWNER);
                this.state = 313;
                this.qualifiedName();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 314;
                this.match(SerParser.WHEN);
                this.state = 315;
                this.match(SerParser.ASSIGNMENT);
                this.state = 316;
                this.match(SerParser.FIELD);
                this.state = 317;
                this.valueToken();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public traceTarget(): TraceTargetContext {
        let localContext = new TraceTargetContext(this.context, this.state);
        this.enterRule(localContext, 40, SerParser.RULE_traceTarget);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 320;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 262144000) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public buildExpr(): BuildExprContext {
        let localContext = new BuildExprContext(this.context, this.state);
        this.enterRule(localContext, 42, SerParser.RULE_buildExpr);
        try {
            this.state = 329;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SerParser.STRING:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 322;
                this.match(SerParser.STRING);
                }
                break;
            case SerParser.DEFAULT:
            case SerParser.KEY:
            case SerParser.DECORATOR:
            case SerParser.METHOD:
            case SerParser.CLASS:
            case SerParser.FIELD:
            case SerParser.CALL:
            case SerParser.PARAMETER:
            case SerParser.RETURN:
            case SerParser.ASSIGNMENT:
            case SerParser.NEW:
            case SerParser.LITERAL:
            case SerParser.NAME:
            case SerParser.VALUE:
            case SerParser.RAW:
            case SerParser.TYPE:
            case SerParser.OWNER:
            case SerParser.SIGNATURE:
            case SerParser.IDENT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 323;
                localContext._refName = this.nameItem();
                }
                break;
            case SerParser.CONCAT:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 324;
                this.match(SerParser.CONCAT);
                this.state = 325;
                this.match(SerParser.LPAREN);
                this.state = 326;
                this.concatList();
                this.state = 327;
                this.match(SerParser.RPAREN);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public concatList(): ConcatListContext {
        let localContext = new ConcatListContext(this.context, this.state);
        this.enterRule(localContext, 44, SerParser.RULE_concatList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 331;
            this.concatItem();
            this.state = 336;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 46) {
                {
                {
                this.state = 332;
                this.match(SerParser.COMMA);
                this.state = 333;
                this.concatItem();
                }
                }
                this.state = 338;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public concatItem(): ConcatItemContext {
        let localContext = new ConcatItemContext(this.context, this.state);
        this.enterRule(localContext, 46, SerParser.RULE_concatItem);
        try {
            this.state = 341;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SerParser.DEFAULT:
            case SerParser.KEY:
            case SerParser.DECORATOR:
            case SerParser.METHOD:
            case SerParser.CLASS:
            case SerParser.FIELD:
            case SerParser.CALL:
            case SerParser.PARAMETER:
            case SerParser.RETURN:
            case SerParser.ASSIGNMENT:
            case SerParser.NEW:
            case SerParser.LITERAL:
            case SerParser.NAME:
            case SerParser.VALUE:
            case SerParser.RAW:
            case SerParser.TYPE:
            case SerParser.OWNER:
            case SerParser.SIGNATURE:
            case SerParser.IDENT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 339;
                this.nameItem();
                }
                break;
            case SerParser.STRING:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 340;
                this.match(SerParser.STRING);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public pipelineStep(): PipelineStepContext {
        let localContext = new PipelineStepContext(this.context, this.state);
        this.enterRule(localContext, 48, SerParser.RULE_pipelineStep);
        let _la: number;
        try {
            this.state = 365;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 25, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 343;
                this.match(SerParser.PIPE);
                this.state = 344;
                this.match(SerParser.NORMALIZE);
                this.state = 345;
                this.match(SerParser.IDENT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 346;
                this.match(SerParser.PIPE);
                this.state = 347;
                this.match(SerParser.REGEX);
                this.state = 348;
                this.match(SerParser.STRING);
                this.state = 349;
                this.match(SerParser.GROUP);
                this.state = 350;
                this.match(SerParser.INT);
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 351;
                this.match(SerParser.PIPE);
                this.state = 352;
                this.match(SerParser.REPLACE);
                this.state = 353;
                this.match(SerParser.STRING);
                this.state = 354;
                this.match(SerParser.STRING);
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 355;
                this.match(SerParser.PIPE);
                this.state = 356;
                this.match(SerParser.MAP);
                this.state = 357;
                this.match(SerParser.LBRACE);
                this.state = 361;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 58) {
                    {
                    {
                    this.state = 358;
                    this.mapEntry();
                    }
                    }
                    this.state = 363;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 364;
                this.match(SerParser.RBRACE);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public methodPattern(): MethodPatternContext {
        let localContext = new MethodPatternContext(this.context, this.state);
        this.enterRule(localContext, 50, SerParser.RULE_methodPattern);
        try {
            this.state = 377;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 26, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 367;
                this.qualifiedName();
                this.state = 368;
                this.match(SerParser.DOT);
                this.state = 369;
                this.match(SerParser.LBRACK);
                this.state = 370;
                this.identList();
                this.state = 371;
                this.match(SerParser.RBRACK);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 373;
                this.qualifiedName();
                this.state = 374;
                this.match(SerParser.DOT);
                this.state = 375;
                this.match(SerParser.IDENT);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public qualifiedName(): QualifiedNameContext {
        let localContext = new QualifiedNameContext(this.context, this.state);
        this.enterRule(localContext, 52, SerParser.RULE_qualifiedName);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 379;
            this.match(SerParser.IDENT);
            this.state = 384;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 27, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 380;
                    this.match(SerParser.DOT);
                    this.state = 381;
                    this.match(SerParser.IDENT);
                    }
                    }
                }
                this.state = 386;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 27, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public annotationRef(): AnnotationRefContext {
        let localContext = new AnnotationRefContext(this.context, this.state);
        this.enterRule(localContext, 54, SerParser.RULE_annotationRef);
        try {
            this.state = 392;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 28, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 387;
                this.match(SerParser.AT);
                this.state = 388;
                this.match(SerParser.IDENT);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 389;
                this.match(SerParser.AT);
                this.state = 390;
                this.match(SerParser.STAR);
                this.state = 391;
                this.match(SerParser.IDENT);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public decoratorRef(): DecoratorRefContext {
        let localContext = new DecoratorRefContext(this.context, this.state);
        this.enterRule(localContext, 56, SerParser.RULE_decoratorRef);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 395;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 49) {
                {
                this.state = 394;
                this.match(SerParser.AT);
                }
            }

            this.state = 397;
            this.match(SerParser.IDENT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elementRef(): ElementRefContext {
        let localContext = new ElementRefContext(this.context, this.state);
        this.enterRule(localContext, 58, SerParser.RULE_elementRef);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 399;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 48234496) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public identList(): IdentListContext {
        let localContext = new IdentListContext(this.context, this.state);
        this.enterRule(localContext, 60, SerParser.RULE_identList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 401;
            this.nameItem();
            this.state = 406;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 46) {
                {
                {
                this.state = 402;
                this.match(SerParser.COMMA);
                this.state = 403;
                this.nameItem();
                }
                }
                this.state = 408;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public findName(): FindNameContext {
        let localContext = new FindNameContext(this.context, this.state);
        this.enterRule(localContext, 62, SerParser.RULE_findName);
        try {
            this.state = 414;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SerParser.DEFAULT:
            case SerParser.KEY:
            case SerParser.DECORATOR:
            case SerParser.METHOD:
            case SerParser.CLASS:
            case SerParser.FIELD:
            case SerParser.CALL:
            case SerParser.PARAMETER:
            case SerParser.RETURN:
            case SerParser.ASSIGNMENT:
            case SerParser.NEW:
            case SerParser.LITERAL:
            case SerParser.NAME:
            case SerParser.VALUE:
            case SerParser.RAW:
            case SerParser.TYPE:
            case SerParser.OWNER:
            case SerParser.SIGNATURE:
            case SerParser.IDENT:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 409;
                this.nameItem();
                }
                break;
            case SerParser.LBRACK:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 410;
                this.match(SerParser.LBRACK);
                this.state = 411;
                this.identList();
                this.state = 412;
                this.match(SerParser.RBRACK);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public nameItem(): NameItemContext {
        let localContext = new NameItemContext(this.context, this.state);
        this.enterRule(localContext, 64, SerParser.RULE_nameItem);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 416;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 4293462016) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 67108879) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public literal(): LiteralContext {
        let localContext = new LiteralContext(this.context, this.state);
        this.enterRule(localContext, 66, SerParser.RULE_literal);
        try {
            this.state = 420;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case SerParser.STRING:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 418;
                this.match(SerParser.STRING);
                }
                break;
            case SerParser.IDENT:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 419;
                this.valueToken();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public valueToken(): ValueTokenContext {
        let localContext = new ValueTokenContext(this.context, this.state);
        this.enterRule(localContext, 68, SerParser.RULE_valueToken);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 422;
            this.match(SerParser.IDENT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,61,425,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,
        7,33,2,34,7,34,1,0,1,0,1,0,1,0,5,0,75,8,0,10,0,12,0,78,9,0,1,0,5,
        0,81,8,0,10,0,12,0,84,9,0,1,0,1,0,1,0,1,1,1,1,5,1,91,8,1,10,1,12,
        1,94,9,1,1,1,1,1,1,2,1,2,1,2,1,3,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,
        1,5,1,6,1,6,3,6,113,8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,
        1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,
        3,7,141,8,7,3,7,143,8,7,1,8,1,8,1,8,1,8,4,8,149,8,8,11,8,12,8,150,
        1,8,3,8,154,8,8,1,8,3,8,157,8,8,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,
        10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,
        10,1,10,1,10,1,10,1,10,3,10,184,8,10,1,10,1,10,3,10,188,8,10,1,10,
        1,10,1,10,1,10,1,10,1,10,1,10,1,10,3,10,198,8,10,3,10,200,8,10,1,
        11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,3,11,214,
        8,11,1,12,1,12,1,12,1,13,1,13,1,13,5,13,222,8,13,10,13,12,13,225,
        9,13,1,13,1,13,1,14,1,14,1,14,1,14,1,15,1,15,1,15,5,15,236,8,15,
        10,15,12,15,239,9,15,1,15,1,15,1,16,1,16,1,16,1,16,5,16,247,8,16,
        10,16,12,16,250,9,16,1,17,1,17,1,17,1,17,1,17,3,17,257,8,17,1,18,
        1,18,1,18,5,18,262,8,18,10,18,12,18,265,9,18,1,18,5,18,268,8,18,
        10,18,12,18,271,9,18,1,18,1,18,1,19,1,19,1,19,1,19,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,3,19,319,
        8,19,1,20,1,20,1,21,1,21,1,21,1,21,1,21,1,21,1,21,3,21,330,8,21,
        1,22,1,22,1,22,5,22,335,8,22,10,22,12,22,338,9,22,1,23,1,23,3,23,
        342,8,23,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,
        1,24,1,24,1,24,1,24,1,24,5,24,360,8,24,10,24,12,24,363,9,24,1,24,
        3,24,366,8,24,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,1,25,
        3,25,378,8,25,1,26,1,26,1,26,5,26,383,8,26,10,26,12,26,386,9,26,
        1,27,1,27,1,27,1,27,1,27,3,27,393,8,27,1,28,3,28,396,8,28,1,28,1,
        28,1,29,1,29,1,30,1,30,1,30,5,30,405,8,30,10,30,12,30,408,9,30,1,
        31,1,31,1,31,1,31,1,31,3,31,415,8,31,1,32,1,32,1,33,1,33,3,33,421,
        8,33,1,34,1,34,1,34,0,0,35,0,2,4,6,8,10,12,14,16,18,20,22,24,26,
        28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,0,
        3,2,0,21,21,23,27,2,0,21,23,25,25,5,0,11,11,16,16,19,19,21,35,58,
        58,460,0,70,1,0,0,0,2,88,1,0,0,0,4,97,1,0,0,0,6,100,1,0,0,0,8,103,
        1,0,0,0,10,107,1,0,0,0,12,112,1,0,0,0,14,142,1,0,0,0,16,144,1,0,
        0,0,18,158,1,0,0,0,20,199,1,0,0,0,22,213,1,0,0,0,24,215,1,0,0,0,
        26,218,1,0,0,0,28,228,1,0,0,0,30,232,1,0,0,0,32,242,1,0,0,0,34,256,
        1,0,0,0,36,258,1,0,0,0,38,318,1,0,0,0,40,320,1,0,0,0,42,329,1,0,
        0,0,44,331,1,0,0,0,46,341,1,0,0,0,48,365,1,0,0,0,50,377,1,0,0,0,
        52,379,1,0,0,0,54,392,1,0,0,0,56,395,1,0,0,0,58,399,1,0,0,0,60,401,
        1,0,0,0,62,414,1,0,0,0,64,416,1,0,0,0,66,420,1,0,0,0,68,422,1,0,
        0,0,70,71,3,4,2,0,71,72,3,12,6,0,72,76,3,14,7,0,73,75,3,38,19,0,
        74,73,1,0,0,0,75,78,1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,0,77,82,1,
        0,0,0,78,76,1,0,0,0,79,81,3,16,8,0,80,79,1,0,0,0,81,84,1,0,0,0,82,
        80,1,0,0,0,82,83,1,0,0,0,83,85,1,0,0,0,84,82,1,0,0,0,85,86,3,30,
        15,0,86,87,5,0,0,1,87,1,1,0,0,0,88,92,3,6,3,0,89,91,3,36,18,0,90,
        89,1,0,0,0,91,94,1,0,0,0,92,90,1,0,0,0,92,93,1,0,0,0,93,95,1,0,0,
        0,94,92,1,0,0,0,95,96,5,0,0,1,96,3,1,0,0,0,97,98,5,1,0,0,98,99,5,
        57,0,0,99,5,1,0,0,0,100,101,5,2,0,0,101,102,5,57,0,0,102,7,1,0,0,
        0,103,104,5,3,0,0,104,105,3,68,34,0,105,106,3,68,34,0,106,9,1,0,
        0,0,107,108,5,4,0,0,108,109,3,68,34,0,109,11,1,0,0,0,110,113,3,8,
        4,0,111,113,3,10,5,0,112,110,1,0,0,0,112,111,1,0,0,0,113,13,1,0,
        0,0,114,115,5,5,0,0,115,116,5,21,0,0,116,117,5,6,0,0,117,118,5,18,
        0,0,118,143,3,54,27,0,119,120,5,5,0,0,120,121,5,21,0,0,121,143,3,
        50,25,0,122,123,5,5,0,0,123,124,5,22,0,0,124,125,5,6,0,0,125,126,
        5,18,0,0,126,143,3,54,27,0,127,128,5,5,0,0,128,143,5,22,0,0,129,
        130,5,5,0,0,130,131,5,23,0,0,131,132,5,6,0,0,132,133,5,18,0,0,133,
        143,3,54,27,0,134,135,5,5,0,0,135,136,5,23,0,0,136,143,3,64,32,0,
        137,138,5,5,0,0,138,140,3,64,32,0,139,141,3,62,31,0,140,139,1,0,
        0,0,140,141,1,0,0,0,141,143,1,0,0,0,142,114,1,0,0,0,142,119,1,0,
        0,0,142,122,1,0,0,0,142,127,1,0,0,0,142,129,1,0,0,0,142,134,1,0,
        0,0,142,137,1,0,0,0,143,15,1,0,0,0,144,145,5,7,0,0,145,146,3,64,
        32,0,146,148,5,44,0,0,147,149,3,18,9,0,148,147,1,0,0,0,149,150,1,
        0,0,0,150,148,1,0,0,0,150,151,1,0,0,0,151,153,1,0,0,0,152,154,3,
        24,12,0,153,152,1,0,0,0,153,154,1,0,0,0,154,156,1,0,0,0,155,157,
        3,26,13,0,156,155,1,0,0,0,156,157,1,0,0,0,157,17,1,0,0,0,158,159,
        5,8,0,0,159,160,3,20,10,0,160,161,5,10,0,0,161,162,3,22,11,0,162,
        19,1,0,0,0,163,164,5,18,0,0,164,165,5,9,0,0,165,166,3,58,29,0,166,
        167,3,54,27,0,167,200,1,0,0,0,168,169,5,19,0,0,169,170,5,9,0,0,170,
        171,3,58,29,0,171,172,3,56,28,0,172,200,1,0,0,0,173,174,5,20,0,0,
        174,175,5,53,0,0,175,176,5,59,0,0,176,200,5,54,0,0,177,200,5,24,
        0,0,178,200,5,19,0,0,179,200,5,21,0,0,180,200,5,22,0,0,181,183,5,
        23,0,0,182,184,3,64,32,0,183,182,1,0,0,0,183,184,1,0,0,0,184,200,
        1,0,0,0,185,187,5,25,0,0,186,188,3,64,32,0,187,186,1,0,0,0,187,188,
        1,0,0,0,188,200,1,0,0,0,189,200,5,26,0,0,190,200,5,27,0,0,191,192,
        5,28,0,0,192,200,3,52,26,0,193,194,5,29,0,0,194,200,3,66,33,0,195,
        197,3,64,32,0,196,198,3,64,32,0,197,196,1,0,0,0,197,198,1,0,0,0,
        198,200,1,0,0,0,199,163,1,0,0,0,199,168,1,0,0,0,199,173,1,0,0,0,
        199,177,1,0,0,0,199,178,1,0,0,0,199,179,1,0,0,0,199,180,1,0,0,0,
        199,181,1,0,0,0,199,185,1,0,0,0,199,189,1,0,0,0,199,190,1,0,0,0,
        199,191,1,0,0,0,199,193,1,0,0,0,199,195,1,0,0,0,200,21,1,0,0,0,201,
        214,5,30,0,0,202,214,5,31,0,0,203,214,5,32,0,0,204,214,5,33,0,0,
        205,214,5,34,0,0,206,214,5,35,0,0,207,208,5,36,0,0,208,209,5,55,
        0,0,209,210,3,60,30,0,210,211,5,56,0,0,211,214,1,0,0,0,212,214,3,
        64,32,0,213,201,1,0,0,0,213,202,1,0,0,0,213,203,1,0,0,0,213,204,
        1,0,0,0,213,205,1,0,0,0,213,206,1,0,0,0,213,207,1,0,0,0,213,212,
        1,0,0,0,214,23,1,0,0,0,215,216,5,11,0,0,216,217,3,66,33,0,217,25,
        1,0,0,0,218,219,5,12,0,0,219,223,5,51,0,0,220,222,3,28,14,0,221,
        220,1,0,0,0,222,225,1,0,0,0,223,221,1,0,0,0,223,224,1,0,0,0,224,
        226,1,0,0,0,225,223,1,0,0,0,226,227,5,52,0,0,227,27,1,0,0,0,228,
        229,3,68,34,0,229,230,5,45,0,0,230,231,3,68,34,0,231,29,1,0,0,0,
        232,233,5,13,0,0,233,237,5,51,0,0,234,236,3,32,16,0,235,234,1,0,
        0,0,236,239,1,0,0,0,237,235,1,0,0,0,237,238,1,0,0,0,238,240,1,0,
        0,0,239,237,1,0,0,0,240,241,5,52,0,0,241,31,1,0,0,0,242,243,3,34,
        17,0,243,244,5,45,0,0,244,248,3,42,21,0,245,247,3,48,24,0,246,245,
        1,0,0,0,247,250,1,0,0,0,248,246,1,0,0,0,248,249,1,0,0,0,249,33,1,
        0,0,0,250,248,1,0,0,0,251,257,3,64,32,0,252,257,5,16,0,0,253,257,
        5,11,0,0,254,257,5,34,0,0,255,257,5,35,0,0,256,251,1,0,0,0,256,252,
        1,0,0,0,256,253,1,0,0,0,256,254,1,0,0,0,256,255,1,0,0,0,257,35,1,
        0,0,0,258,259,5,8,0,0,259,263,3,40,20,0,260,262,3,38,19,0,261,260,
        1,0,0,0,262,265,1,0,0,0,263,261,1,0,0,0,263,264,1,0,0,0,264,269,
        1,0,0,0,265,263,1,0,0,0,266,268,3,16,8,0,267,266,1,0,0,0,268,271,
        1,0,0,0,269,267,1,0,0,0,269,270,1,0,0,0,270,272,1,0,0,0,271,269,
        1,0,0,0,272,273,3,30,15,0,273,37,1,0,0,0,274,275,5,15,0,0,275,276,
        5,18,0,0,276,277,3,54,27,0,277,278,5,9,0,0,278,279,3,58,29,0,279,
        319,1,0,0,0,280,281,5,15,0,0,281,282,5,21,0,0,282,319,3,50,25,0,
        283,284,5,15,0,0,284,285,5,24,0,0,285,319,3,50,25,0,286,287,5,15,
        0,0,287,288,5,23,0,0,288,289,5,30,0,0,289,319,3,68,34,0,290,291,
        5,15,0,0,291,292,5,23,0,0,292,293,5,33,0,0,293,319,3,52,26,0,294,
        295,5,15,0,0,295,296,5,25,0,0,296,297,5,30,0,0,297,319,3,68,34,0,
        298,299,5,15,0,0,299,300,5,25,0,0,300,301,5,33,0,0,301,319,3,52,
        26,0,302,303,5,15,0,0,303,304,5,21,0,0,304,305,5,30,0,0,305,319,
        3,68,34,0,306,307,5,15,0,0,307,308,5,24,0,0,308,309,5,30,0,0,309,
        319,3,68,34,0,310,311,5,15,0,0,311,312,5,24,0,0,312,313,5,34,0,0,
        313,319,3,52,26,0,314,315,5,15,0,0,315,316,5,27,0,0,316,317,5,23,
        0,0,317,319,3,68,34,0,318,274,1,0,0,0,318,280,1,0,0,0,318,283,1,
        0,0,0,318,286,1,0,0,0,318,290,1,0,0,0,318,294,1,0,0,0,318,298,1,
        0,0,0,318,302,1,0,0,0,318,306,1,0,0,0,318,310,1,0,0,0,318,314,1,
        0,0,0,319,39,1,0,0,0,320,321,7,0,0,0,321,41,1,0,0,0,322,330,5,57,
        0,0,323,330,3,64,32,0,324,325,5,37,0,0,325,326,5,55,0,0,326,327,
        3,44,22,0,327,328,5,56,0,0,328,330,1,0,0,0,329,322,1,0,0,0,329,323,
        1,0,0,0,329,324,1,0,0,0,330,43,1,0,0,0,331,336,3,46,23,0,332,333,
        5,46,0,0,333,335,3,46,23,0,334,332,1,0,0,0,335,338,1,0,0,0,336,334,
        1,0,0,0,336,337,1,0,0,0,337,45,1,0,0,0,338,336,1,0,0,0,339,342,3,
        64,32,0,340,342,5,57,0,0,341,339,1,0,0,0,341,340,1,0,0,0,342,47,
        1,0,0,0,343,344,5,48,0,0,344,345,5,38,0,0,345,366,5,58,0,0,346,347,
        5,48,0,0,347,348,5,39,0,0,348,349,5,57,0,0,349,350,5,41,0,0,350,
        366,5,59,0,0,351,352,5,48,0,0,352,353,5,40,0,0,353,354,5,57,0,0,
        354,366,5,57,0,0,355,356,5,48,0,0,356,357,5,12,0,0,357,361,5,51,
        0,0,358,360,3,28,14,0,359,358,1,0,0,0,360,363,1,0,0,0,361,359,1,
        0,0,0,361,362,1,0,0,0,362,364,1,0,0,0,363,361,1,0,0,0,364,366,5,
        52,0,0,365,343,1,0,0,0,365,346,1,0,0,0,365,351,1,0,0,0,365,355,1,
        0,0,0,366,49,1,0,0,0,367,368,3,52,26,0,368,369,5,47,0,0,369,370,
        5,53,0,0,370,371,3,60,30,0,371,372,5,54,0,0,372,378,1,0,0,0,373,
        374,3,52,26,0,374,375,5,47,0,0,375,376,5,58,0,0,376,378,1,0,0,0,
        377,367,1,0,0,0,377,373,1,0,0,0,378,51,1,0,0,0,379,384,5,58,0,0,
        380,381,5,47,0,0,381,383,5,58,0,0,382,380,1,0,0,0,383,386,1,0,0,
        0,384,382,1,0,0,0,384,385,1,0,0,0,385,53,1,0,0,0,386,384,1,0,0,0,
        387,388,5,49,0,0,388,393,5,58,0,0,389,390,5,49,0,0,390,391,5,50,
        0,0,391,393,5,58,0,0,392,387,1,0,0,0,392,389,1,0,0,0,393,55,1,0,
        0,0,394,396,5,49,0,0,395,394,1,0,0,0,395,396,1,0,0,0,396,397,1,0,
        0,0,397,398,5,58,0,0,398,57,1,0,0,0,399,400,7,1,0,0,400,59,1,0,0,
        0,401,406,3,64,32,0,402,403,5,46,0,0,403,405,3,64,32,0,404,402,1,
        0,0,0,405,408,1,0,0,0,406,404,1,0,0,0,406,407,1,0,0,0,407,61,1,0,
        0,0,408,406,1,0,0,0,409,415,3,64,32,0,410,411,5,53,0,0,411,412,3,
        60,30,0,412,413,5,54,0,0,413,415,1,0,0,0,414,409,1,0,0,0,414,410,
        1,0,0,0,415,63,1,0,0,0,416,417,7,2,0,0,417,65,1,0,0,0,418,421,5,
        57,0,0,419,421,3,68,34,0,420,418,1,0,0,0,420,419,1,0,0,0,421,67,
        1,0,0,0,422,423,5,58,0,0,423,69,1,0,0,0,33,76,82,92,112,140,142,
        150,153,156,183,187,197,199,213,223,237,248,256,263,269,318,329,
        336,341,361,365,377,384,392,395,406,414,420
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!SerParser.__ATN) {
            SerParser.__ATN = new antlr.ATNDeserializer().deserialize(SerParser._serializedATN);
        }

        return SerParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(SerParser.literalNames, SerParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return SerParser.vocabulary;
    }

    private static readonly decisionsToDFA = SerParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class RuleFileContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ruleDecl(): RuleDeclContext {
        return this.getRuleContext(0, RuleDeclContext)!;
    }
    public ruleTargetDecl(): RuleTargetDeclContext {
        return this.getRuleContext(0, RuleTargetDeclContext)!;
    }
    public findDecl(): FindDeclContext {
        return this.getRuleContext(0, FindDeclContext)!;
    }
    public buildDecl(): BuildDeclContext {
        return this.getRuleContext(0, BuildDeclContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SerParser.EOF, 0)!;
    }
    public whenDecl(): WhenDeclContext[];
    public whenDecl(i: number): WhenDeclContext | null;
    public whenDecl(i?: number): WhenDeclContext[] | WhenDeclContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WhenDeclContext);
        }

        return this.getRuleContext(i, WhenDeclContext);
    }
    public letDecl(): LetDeclContext[];
    public letDecl(i: number): LetDeclContext | null;
    public letDecl(i?: number): LetDeclContext[] | LetDeclContext | null {
        if (i === undefined) {
            return this.getRuleContexts(LetDeclContext);
        }

        return this.getRuleContext(i, LetDeclContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_ruleFile;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterRuleFile) {
             listener.enterRuleFile(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitRuleFile) {
             listener.exitRuleFile(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitRuleFile) {
            return visitor.visitRuleFile(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TraceFileContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public traceDecl(): TraceDeclContext {
        return this.getRuleContext(0, TraceDeclContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(SerParser.EOF, 0)!;
    }
    public traceEntry(): TraceEntryContext[];
    public traceEntry(i: number): TraceEntryContext | null;
    public traceEntry(i?: number): TraceEntryContext[] | TraceEntryContext | null {
        if (i === undefined) {
            return this.getRuleContexts(TraceEntryContext);
        }

        return this.getRuleContext(i, TraceEntryContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_traceFile;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterTraceFile) {
             listener.enterTraceFile(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitTraceFile) {
             listener.exitTraceFile(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitTraceFile) {
            return visitor.visitTraceFile(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RuleDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RULE(): antlr.TerminalNode {
        return this.getToken(SerParser.RULE, 0)!;
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(SerParser.STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_ruleDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterRuleDecl) {
             listener.enterRuleDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitRuleDecl) {
             listener.exitRuleDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitRuleDecl) {
            return visitor.visitRuleDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TraceDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TRACE(): antlr.TerminalNode {
        return this.getToken(SerParser.TRACE, 0)!;
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(SerParser.STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_traceDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterTraceDecl) {
             listener.enterTraceDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitTraceDecl) {
             listener.exitTraceDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitTraceDecl) {
            return visitor.visitTraceDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EndpointDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ENDPOINT(): antlr.TerminalNode {
        return this.getToken(SerParser.ENDPOINT, 0)!;
    }
    public valueToken(): ValueTokenContext[];
    public valueToken(i: number): ValueTokenContext | null;
    public valueToken(i?: number): ValueTokenContext[] | ValueTokenContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ValueTokenContext);
        }

        return this.getRuleContext(i, ValueTokenContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_endpointDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterEndpointDecl) {
             listener.enterEndpointDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitEndpointDecl) {
             listener.exitEndpointDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitEndpointDecl) {
            return visitor.visitEndpointDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FactDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FACT(): antlr.TerminalNode {
        return this.getToken(SerParser.FACT, 0)!;
    }
    public valueToken(): ValueTokenContext {
        return this.getRuleContext(0, ValueTokenContext)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_factDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterFactDecl) {
             listener.enterFactDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitFactDecl) {
             listener.exitFactDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitFactDecl) {
            return visitor.visitFactDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class RuleTargetDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public endpointDecl(): EndpointDeclContext | null {
        return this.getRuleContext(0, EndpointDeclContext);
    }
    public factDecl(): FactDeclContext | null {
        return this.getRuleContext(0, FactDeclContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_ruleTargetDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterRuleTargetDecl) {
             listener.enterRuleTargetDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitRuleTargetDecl) {
             listener.exitRuleTargetDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitRuleTargetDecl) {
            return visitor.visitRuleTargetDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FindDeclContext extends antlr.ParserRuleContext {
    public _fieldName?: NameItemContext;
    public _genericFindKind?: NameItemContext;
    public _genericFindName?: FindNameContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FIND(): antlr.TerminalNode {
        return this.getToken(SerParser.FIND, 0)!;
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public WITH(): antlr.TerminalNode | null {
        return this.getToken(SerParser.WITH, 0);
    }
    public ANNOTATION(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ANNOTATION, 0);
    }
    public annotationRef(): AnnotationRefContext | null {
        return this.getRuleContext(0, AnnotationRefContext);
    }
    public methodPattern(): MethodPatternContext | null {
        return this.getRuleContext(0, MethodPatternContext);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CLASS, 0);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public findName(): FindNameContext | null {
        return this.getRuleContext(0, FindNameContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_findDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterFindDecl) {
             listener.enterFindDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitFindDecl) {
             listener.exitFindDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitFindDecl) {
            return visitor.visitFindDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LetDeclContext extends antlr.ParserRuleContext {
    public _letName?: NameItemContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LET(): antlr.TerminalNode {
        return this.getToken(SerParser.LET, 0)!;
    }
    public EQ(): antlr.TerminalNode {
        return this.getToken(SerParser.EQ, 0)!;
    }
    public nameItem(): NameItemContext {
        return this.getRuleContext(0, NameItemContext)!;
    }
    public sourceLine(): SourceLineContext[];
    public sourceLine(i: number): SourceLineContext | null;
    public sourceLine(i?: number): SourceLineContext[] | SourceLineContext | null {
        if (i === undefined) {
            return this.getRuleContexts(SourceLineContext);
        }

        return this.getRuleContext(i, SourceLineContext);
    }
    public defaultLine(): DefaultLineContext | null {
        return this.getRuleContext(0, DefaultLineContext);
    }
    public mapBlock(): MapBlockContext | null {
        return this.getRuleContext(0, MapBlockContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_letDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterLetDecl) {
             listener.enterLetDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitLetDecl) {
             listener.exitLetDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitLetDecl) {
            return visitor.visitLetDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SourceLineContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(SerParser.FROM, 0)!;
    }
    public sourceExpr(): SourceExprContext {
        return this.getRuleContext(0, SourceExprContext)!;
    }
    public TAKE(): antlr.TerminalNode {
        return this.getToken(SerParser.TAKE, 0)!;
    }
    public takeExpr(): TakeExprContext {
        return this.getRuleContext(0, TakeExprContext)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_sourceLine;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterSourceLine) {
             listener.enterSourceLine(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitSourceLine) {
             listener.exitSourceLine(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitSourceLine) {
            return visitor.visitSourceLine(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SourceExprContext extends antlr.ParserRuleContext {
    public _sourceName?: NameItemContext;
    public _genericSourceKind?: NameItemContext;
    public _genericSourceName?: NameItemContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ANNOTATION(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ANNOTATION, 0);
    }
    public ON(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ON, 0);
    }
    public elementRef(): ElementRefContext | null {
        return this.getRuleContext(0, ElementRefContext);
    }
    public annotationRef(): AnnotationRefContext | null {
        return this.getRuleContext(0, AnnotationRefContext);
    }
    public DECORATOR(): antlr.TerminalNode | null {
        return this.getToken(SerParser.DECORATOR, 0);
    }
    public decoratorRef(): DecoratorRefContext | null {
        return this.getRuleContext(0, DecoratorRefContext);
    }
    public ARGUMENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ARGUMENT, 0);
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LBRACK, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.INT, 0);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RBRACK, 0);
    }
    public CALL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CALL, 0);
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CLASS, 0);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public nameItem(): NameItemContext[];
    public nameItem(i: number): NameItemContext | null;
    public nameItem(i?: number): NameItemContext[] | NameItemContext | null {
        if (i === undefined) {
            return this.getRuleContexts(NameItemContext);
        }

        return this.getRuleContext(i, NameItemContext);
    }
    public PARAMETER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.PARAMETER, 0);
    }
    public RETURN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RETURN, 0);
    }
    public ASSIGNMENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ASSIGNMENT, 0);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NEW, 0);
    }
    public qualifiedName(): QualifiedNameContext | null {
        return this.getRuleContext(0, QualifiedNameContext);
    }
    public LITERAL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LITERAL, 0);
    }
    public literal(): LiteralContext | null {
        return this.getRuleContext(0, LiteralContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_sourceExpr;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterSourceExpr) {
             listener.enterSourceExpr(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitSourceExpr) {
             listener.exitSourceExpr(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitSourceExpr) {
            return visitor.visitSourceExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TakeExprContext extends antlr.ParserRuleContext {
    public _genericTake?: NameItemContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public NAME(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NAME, 0);
    }
    public VALUE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.VALUE, 0);
    }
    public RAW(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RAW, 0);
    }
    public TYPE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.TYPE, 0);
    }
    public OWNER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.OWNER, 0);
    }
    public SIGNATURE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.SIGNATURE, 0);
    }
    public ATTR(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ATTR, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LPAREN, 0);
    }
    public identList(): IdentListContext | null {
        return this.getRuleContext(0, IdentListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RPAREN, 0);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_takeExpr;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterTakeExpr) {
             listener.enterTakeExpr(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitTakeExpr) {
             listener.exitTakeExpr(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitTakeExpr) {
            return visitor.visitTakeExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefaultLineContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DEFAULT(): antlr.TerminalNode {
        return this.getToken(SerParser.DEFAULT, 0)!;
    }
    public literal(): LiteralContext {
        return this.getRuleContext(0, LiteralContext)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_defaultLine;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterDefaultLine) {
             listener.enterDefaultLine(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitDefaultLine) {
             listener.exitDefaultLine(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitDefaultLine) {
            return visitor.visitDefaultLine(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MapBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MAP(): antlr.TerminalNode {
        return this.getToken(SerParser.MAP, 0)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(SerParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(SerParser.RBRACE, 0)!;
    }
    public mapEntry(): MapEntryContext[];
    public mapEntry(i: number): MapEntryContext | null;
    public mapEntry(i?: number): MapEntryContext[] | MapEntryContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MapEntryContext);
        }

        return this.getRuleContext(i, MapEntryContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_mapBlock;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterMapBlock) {
             listener.enterMapBlock(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitMapBlock) {
             listener.exitMapBlock(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitMapBlock) {
            return visitor.visitMapBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MapEntryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public valueToken(): ValueTokenContext[];
    public valueToken(i: number): ValueTokenContext | null;
    public valueToken(i?: number): ValueTokenContext[] | ValueTokenContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ValueTokenContext);
        }

        return this.getRuleContext(i, ValueTokenContext);
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(SerParser.COLON, 0)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_mapEntry;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterMapEntry) {
             listener.enterMapEntry(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitMapEntry) {
             listener.exitMapEntry(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitMapEntry) {
            return visitor.visitMapEntry(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BuildDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BUILD(): antlr.TerminalNode {
        return this.getToken(SerParser.BUILD, 0)!;
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(SerParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(SerParser.RBRACE, 0)!;
    }
    public buildField(): BuildFieldContext[];
    public buildField(i: number): BuildFieldContext | null;
    public buildField(i?: number): BuildFieldContext[] | BuildFieldContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BuildFieldContext);
        }

        return this.getRuleContext(i, BuildFieldContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_buildDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterBuildDecl) {
             listener.enterBuildDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitBuildDecl) {
             listener.exitBuildDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitBuildDecl) {
            return visitor.visitBuildDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BuildFieldContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public buildFieldName(): BuildFieldNameContext {
        return this.getRuleContext(0, BuildFieldNameContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(SerParser.COLON, 0)!;
    }
    public buildExpr(): BuildExprContext {
        return this.getRuleContext(0, BuildExprContext)!;
    }
    public pipelineStep(): PipelineStepContext[];
    public pipelineStep(i: number): PipelineStepContext | null;
    public pipelineStep(i?: number): PipelineStepContext[] | PipelineStepContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PipelineStepContext);
        }

        return this.getRuleContext(i, PipelineStepContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_buildField;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterBuildField) {
             listener.enterBuildField(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitBuildField) {
             listener.exitBuildField(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitBuildField) {
            return visitor.visitBuildField(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BuildFieldNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public KEY(): antlr.TerminalNode | null {
        return this.getToken(SerParser.KEY, 0);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.DEFAULT, 0);
    }
    public OWNER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.OWNER, 0);
    }
    public SIGNATURE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.SIGNATURE, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_buildFieldName;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterBuildFieldName) {
             listener.enterBuildFieldName(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitBuildFieldName) {
             listener.exitBuildFieldName(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitBuildFieldName) {
            return visitor.visitBuildFieldName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TraceEntryContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FROM(): antlr.TerminalNode {
        return this.getToken(SerParser.FROM, 0)!;
    }
    public traceTarget(): TraceTargetContext {
        return this.getRuleContext(0, TraceTargetContext)!;
    }
    public buildDecl(): BuildDeclContext {
        return this.getRuleContext(0, BuildDeclContext)!;
    }
    public whenDecl(): WhenDeclContext[];
    public whenDecl(i: number): WhenDeclContext | null;
    public whenDecl(i?: number): WhenDeclContext[] | WhenDeclContext | null {
        if (i === undefined) {
            return this.getRuleContexts(WhenDeclContext);
        }

        return this.getRuleContext(i, WhenDeclContext);
    }
    public letDecl(): LetDeclContext[];
    public letDecl(i: number): LetDeclContext | null;
    public letDecl(i?: number): LetDeclContext[] | LetDeclContext | null {
        if (i === undefined) {
            return this.getRuleContexts(LetDeclContext);
        }

        return this.getRuleContext(i, LetDeclContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_traceEntry;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterTraceEntry) {
             listener.enterTraceEntry(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitTraceEntry) {
             listener.exitTraceEntry(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitTraceEntry) {
            return visitor.visitTraceEntry(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WhenDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHEN(): antlr.TerminalNode {
        return this.getToken(SerParser.WHEN, 0)!;
    }
    public ANNOTATION(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ANNOTATION, 0);
    }
    public annotationRef(): AnnotationRefContext | null {
        return this.getRuleContext(0, AnnotationRefContext);
    }
    public ON(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ON, 0);
    }
    public elementRef(): ElementRefContext | null {
        return this.getRuleContext(0, ElementRefContext);
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public methodPattern(): MethodPatternContext | null {
        return this.getRuleContext(0, MethodPatternContext);
    }
    public CALL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CALL, 0);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public NAME(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NAME, 0);
    }
    public valueToken(): ValueTokenContext | null {
        return this.getRuleContext(0, ValueTokenContext);
    }
    public TYPE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.TYPE, 0);
    }
    public qualifiedName(): QualifiedNameContext | null {
        return this.getRuleContext(0, QualifiedNameContext);
    }
    public PARAMETER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.PARAMETER, 0);
    }
    public OWNER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.OWNER, 0);
    }
    public ASSIGNMENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ASSIGNMENT, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_whenDecl;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterWhenDecl) {
             listener.enterWhenDecl(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitWhenDecl) {
             listener.exitWhenDecl(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitWhenDecl) {
            return visitor.visitWhenDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TraceTargetContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public CALL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CALL, 0);
    }
    public PARAMETER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.PARAMETER, 0);
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public RETURN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RETURN, 0);
    }
    public ASSIGNMENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ASSIGNMENT, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_traceTarget;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterTraceTarget) {
             listener.enterTraceTarget(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitTraceTarget) {
             listener.exitTraceTarget(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitTraceTarget) {
            return visitor.visitTraceTarget(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BuildExprContext extends antlr.ParserRuleContext {
    public _refName?: NameItemContext;
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(SerParser.STRING, 0);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public CONCAT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CONCAT, 0);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LPAREN, 0);
    }
    public concatList(): ConcatListContext | null {
        return this.getRuleContext(0, ConcatListContext);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RPAREN, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_buildExpr;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterBuildExpr) {
             listener.enterBuildExpr(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitBuildExpr) {
             listener.exitBuildExpr(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitBuildExpr) {
            return visitor.visitBuildExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConcatListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public concatItem(): ConcatItemContext[];
    public concatItem(i: number): ConcatItemContext | null;
    public concatItem(i?: number): ConcatItemContext[] | ConcatItemContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ConcatItemContext);
        }

        return this.getRuleContext(i, ConcatItemContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SerParser.COMMA);
    	} else {
    		return this.getToken(SerParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_concatList;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterConcatList) {
             listener.enterConcatList(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitConcatList) {
             listener.exitConcatList(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitConcatList) {
            return visitor.visitConcatList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ConcatItemContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(SerParser.STRING, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_concatItem;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterConcatItem) {
             listener.enterConcatItem(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitConcatItem) {
             listener.exitConcatItem(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitConcatItem) {
            return visitor.visitConcatItem(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PipelineStepContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PIPE(): antlr.TerminalNode {
        return this.getToken(SerParser.PIPE, 0)!;
    }
    public NORMALIZE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NORMALIZE, 0);
    }
    public IDENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.IDENT, 0);
    }
    public REGEX(): antlr.TerminalNode | null {
        return this.getToken(SerParser.REGEX, 0);
    }
    public STRING(): antlr.TerminalNode[];
    public STRING(i: number): antlr.TerminalNode | null;
    public STRING(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SerParser.STRING);
    	} else {
    		return this.getToken(SerParser.STRING, i);
    	}
    }
    public GROUP(): antlr.TerminalNode | null {
        return this.getToken(SerParser.GROUP, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.INT, 0);
    }
    public REPLACE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.REPLACE, 0);
    }
    public MAP(): antlr.TerminalNode | null {
        return this.getToken(SerParser.MAP, 0);
    }
    public LBRACE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LBRACE, 0);
    }
    public RBRACE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RBRACE, 0);
    }
    public mapEntry(): MapEntryContext[];
    public mapEntry(i: number): MapEntryContext | null;
    public mapEntry(i?: number): MapEntryContext[] | MapEntryContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MapEntryContext);
        }

        return this.getRuleContext(i, MapEntryContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_pipelineStep;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterPipelineStep) {
             listener.enterPipelineStep(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitPipelineStep) {
             listener.exitPipelineStep(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitPipelineStep) {
            return visitor.visitPipelineStep(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodPatternContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public qualifiedName(): QualifiedNameContext {
        return this.getRuleContext(0, QualifiedNameContext)!;
    }
    public DOT(): antlr.TerminalNode {
        return this.getToken(SerParser.DOT, 0)!;
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LBRACK, 0);
    }
    public identList(): IdentListContext | null {
        return this.getRuleContext(0, IdentListContext);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RBRACK, 0);
    }
    public IDENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.IDENT, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_methodPattern;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterMethodPattern) {
             listener.enterMethodPattern(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitMethodPattern) {
             listener.exitMethodPattern(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitMethodPattern) {
            return visitor.visitMethodPattern(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class QualifiedNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode[];
    public IDENT(i: number): antlr.TerminalNode | null;
    public IDENT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SerParser.IDENT);
    	} else {
    		return this.getToken(SerParser.IDENT, i);
    	}
    }
    public DOT(): antlr.TerminalNode[];
    public DOT(i: number): antlr.TerminalNode | null;
    public DOT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SerParser.DOT);
    	} else {
    		return this.getToken(SerParser.DOT, i);
    	}
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_qualifiedName;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterQualifiedName) {
             listener.enterQualifiedName(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitQualifiedName) {
             listener.exitQualifiedName(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitQualifiedName) {
            return visitor.visitQualifiedName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AnnotationRefContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AT(): antlr.TerminalNode {
        return this.getToken(SerParser.AT, 0)!;
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(SerParser.IDENT, 0)!;
    }
    public STAR(): antlr.TerminalNode | null {
        return this.getToken(SerParser.STAR, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_annotationRef;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterAnnotationRef) {
             listener.enterAnnotationRef(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitAnnotationRef) {
             listener.exitAnnotationRef(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitAnnotationRef) {
            return visitor.visitAnnotationRef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DecoratorRefContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(SerParser.IDENT, 0)!;
    }
    public AT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.AT, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_decoratorRef;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterDecoratorRef) {
             listener.enterDecoratorRef(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitDecoratorRef) {
             listener.exitDecoratorRef(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitDecoratorRef) {
            return visitor.visitDecoratorRef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementRefContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CLASS, 0);
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public PARAMETER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.PARAMETER, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_elementRef;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterElementRef) {
             listener.enterElementRef(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitElementRef) {
             listener.exitElementRef(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitElementRef) {
            return visitor.visitElementRef(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IdentListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nameItem(): NameItemContext[];
    public nameItem(i: number): NameItemContext | null;
    public nameItem(i?: number): NameItemContext[] | NameItemContext | null {
        if (i === undefined) {
            return this.getRuleContexts(NameItemContext);
        }

        return this.getRuleContext(i, NameItemContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(SerParser.COMMA);
    	} else {
    		return this.getToken(SerParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_identList;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterIdentList) {
             listener.enterIdentList(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitIdentList) {
             listener.exitIdentList(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitIdentList) {
            return visitor.visitIdentList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FindNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public nameItem(): NameItemContext | null {
        return this.getRuleContext(0, NameItemContext);
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LBRACK, 0);
    }
    public identList(): IdentListContext | null {
        return this.getRuleContext(0, IdentListContext);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RBRACK, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_findName;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterFindName) {
             listener.enterFindName(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitFindName) {
             listener.exitFindName(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitFindName) {
            return visitor.visitFindName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class NameItemContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.IDENT, 0);
    }
    public NAME(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NAME, 0);
    }
    public VALUE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.VALUE, 0);
    }
    public RAW(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RAW, 0);
    }
    public TYPE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.TYPE, 0);
    }
    public METHOD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.METHOD, 0);
    }
    public CLASS(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CLASS, 0);
    }
    public FIELD(): antlr.TerminalNode | null {
        return this.getToken(SerParser.FIELD, 0);
    }
    public CALL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.CALL, 0);
    }
    public PARAMETER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.PARAMETER, 0);
    }
    public RETURN(): antlr.TerminalNode | null {
        return this.getToken(SerParser.RETURN, 0);
    }
    public ASSIGNMENT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.ASSIGNMENT, 0);
    }
    public NEW(): antlr.TerminalNode | null {
        return this.getToken(SerParser.NEW, 0);
    }
    public LITERAL(): antlr.TerminalNode | null {
        return this.getToken(SerParser.LITERAL, 0);
    }
    public DECORATOR(): antlr.TerminalNode | null {
        return this.getToken(SerParser.DECORATOR, 0);
    }
    public KEY(): antlr.TerminalNode | null {
        return this.getToken(SerParser.KEY, 0);
    }
    public DEFAULT(): antlr.TerminalNode | null {
        return this.getToken(SerParser.DEFAULT, 0);
    }
    public OWNER(): antlr.TerminalNode | null {
        return this.getToken(SerParser.OWNER, 0);
    }
    public SIGNATURE(): antlr.TerminalNode | null {
        return this.getToken(SerParser.SIGNATURE, 0);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_nameItem;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterNameItem) {
             listener.enterNameItem(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitNameItem) {
             listener.exitNameItem(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitNameItem) {
            return visitor.visitNameItem(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LiteralContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(SerParser.STRING, 0);
    }
    public valueToken(): ValueTokenContext | null {
        return this.getRuleContext(0, ValueTokenContext);
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_literal;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterLiteral) {
             listener.enterLiteral(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitLiteral) {
             listener.exitLiteral(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitLiteral) {
            return visitor.visitLiteral(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ValueTokenContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENT(): antlr.TerminalNode {
        return this.getToken(SerParser.IDENT, 0)!;
    }
    public override get ruleIndex(): number {
        return SerParser.RULE_valueToken;
    }
    public override enterRule(listener: SerListener): void {
        if(listener.enterValueToken) {
             listener.enterValueToken(this);
        }
    }
    public override exitRule(listener: SerListener): void {
        if(listener.exitValueToken) {
             listener.exitValueToken(this);
        }
    }
    public override accept<Result>(visitor: SerVisitor<Result>): Result | null {
        if (visitor.visitValueToken) {
            return visitor.visitValueToken(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
