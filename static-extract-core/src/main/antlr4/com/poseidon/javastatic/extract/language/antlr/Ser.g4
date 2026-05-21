grammar Ser;

ruleFile
    : ruleDecl ruleTargetDecl findDecl letDecl* buildDecl EOF
    ;

traceFile
    : traceDecl traceEntry* EOF
    ;

ruleDecl
    : RULE STRING
    ;

traceDecl
    : TRACE STRING
    ;

endpointDecl
    : ENDPOINT valueToken valueToken
    ;

factDecl
    : FACT valueToken
    ;

ruleTargetDecl
    : endpointDecl
    | factDecl
    ;

findDecl
    : FIND METHOD WITH ANNOTATION annotationRef
    | FIND METHOD methodPattern
    | FIND CLASS WITH ANNOTATION annotationRef
    | FIND CLASS
    | FIND FIELD WITH ANNOTATION annotationRef
    | FIND FIELD fieldName=nameItem
    | FIND genericFindKind=nameItem genericFindName=nameItem?
    ;

letDecl
    : LET letName=nameItem EQ sourceLine+ defaultLine? mapBlock?
    ;

sourceLine
    : FROM sourceExpr TAKE takeExpr
    ;

sourceExpr
    : ANNOTATION ON elementRef annotationRef
    | ARGUMENT LBRACK INT RBRACK
    | CALL
    | METHOD
    | CLASS
    | FIELD sourceName=nameItem?
    | PARAMETER sourceName=nameItem?
    | RETURN
    | ASSIGNMENT
    | NEW qualifiedName
    | LITERAL literal
    | genericSourceKind=nameItem genericSourceName=nameItem?
    ;

takeExpr
    : NAME
    | VALUE
    | RAW
    | TYPE
    | OWNER
    | SIGNATURE
    | ATTR LPAREN identList RPAREN
    | genericTake=nameItem
    ;

defaultLine
    : DEFAULT literal
    ;

mapBlock
    : MAP LBRACE mapEntry* RBRACE
    ;

mapEntry
    : valueToken COLON valueToken
    ;

buildDecl
    : BUILD LBRACE buildField* RBRACE
    ;

buildField
    : buildFieldName COLON buildExpr pipelineStep*
    ;

buildFieldName
    : nameItem
    | KEY
    | DEFAULT
    | OWNER
    | SIGNATURE
    ;

traceEntry
    : FROM traceTarget whenDecl* letDecl* buildDecl
    ;

whenDecl
    : WHEN ANNOTATION annotationRef ON elementRef
    | WHEN METHOD methodPattern
    | WHEN CALL methodPattern
    | WHEN FIELD NAME valueToken
    | WHEN FIELD TYPE qualifiedName
    | WHEN PARAMETER NAME valueToken
    | WHEN PARAMETER TYPE qualifiedName
    | WHEN METHOD NAME valueToken
    | WHEN CALL NAME valueToken
    | WHEN CALL OWNER qualifiedName
    | WHEN ASSIGNMENT FIELD valueToken
    ;

traceTarget
    : FIELD
    | CALL
    | PARAMETER
    | METHOD
    | RETURN
    | ASSIGNMENT
    ;

buildExpr
    : STRING
    | refName=nameItem
    | CONCAT LPAREN concatList RPAREN
    ;

concatList
    : concatItem (COMMA concatItem)*
    ;

concatItem
    : nameItem
    | STRING
    ;

pipelineStep
    : PIPE NORMALIZE IDENT
    | PIPE REGEX STRING GROUP INT
    | PIPE REPLACE STRING STRING
    | PIPE MAP LBRACE mapEntry* RBRACE
    ;

methodPattern
    : qualifiedName DOT LBRACK identList RBRACK
    | qualifiedName DOT IDENT
    ;

qualifiedName
    : IDENT (DOT IDENT)*
    ;

annotationRef
    : AT IDENT
    | AT STAR IDENT
    ;

elementRef
    : CLASS
    | METHOD
    | FIELD
    | PARAMETER
    ;

identList
    : nameItem (COMMA nameItem)*
    ;

nameItem
    : IDENT
    | NAME
    | VALUE
    | RAW
    | TYPE
    | METHOD
    | CLASS
    | FIELD
    | CALL
    | PARAMETER
    | RETURN
    | ASSIGNMENT
    | NEW
    | LITERAL
    ;

literal
    : STRING
    | valueToken
    ;

valueToken
    : IDENT
    ;

RULE: 'rule';
TRACE: 'trace';
ENDPOINT: 'endpoint';
FACT: 'fact';
FIND: 'find';
WITH: 'with';
LET: 'let';
FROM: 'from';
ON: 'on';
TAKE: 'take';
DEFAULT: 'default';
MAP: 'map';
BUILD: 'build';
EXTERNAL: 'external';
WHEN: 'when';
KEY: 'key';
RESOLVE: 'resolve';

ANNOTATION: 'annotation';
ARGUMENT: 'argument';
METHOD: 'method';
CLASS: 'class';
FIELD: 'field';
CALL: 'call';
PARAMETER: 'parameter';
RETURN: 'return';
ASSIGNMENT: 'assignment';
NEW: 'new';
LITERAL: 'literal';

NAME: 'name';
VALUE: 'value';
RAW: 'raw';
TYPE: 'type';
OWNER: 'owner';
SIGNATURE: 'signature';
ATTR: 'attr';

CONCAT: 'concat';
NORMALIZE: 'normalize';
REGEX: 'regex';
REPLACE: 'replace';
GROUP: 'group';
PLAIN: 'plain';
PLACEHOLDER: 'placeholder';

EQ: '=';
COLON: ':';
COMMA: ',';
DOT: '.';
PIPE: '|';
AT: '@';
STAR: '*';
LBRACE: '{';
RBRACE: '}';
LBRACK: '[';
RBRACK: ']';
LPAREN: '(';
RPAREN: ')';

STRING
    : '"' ( '\\' . | ~["\\] )* '"'
    ;

IDENT
    : [A-Za-z_][A-Za-z0-9_$-]*
    ;

INT
    : [0-9]+
    ;

LINE_COMMENT
    : '#' ~[\r\n]* -> skip
    ;

WS
    : [ \t\r\n]+ -> skip
    ;
