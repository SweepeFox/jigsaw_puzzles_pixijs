const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const getAllFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(dirPath + "/" + file);
        }
    });

    return arrayOfFiles;
};

const prepareLinks = function (assetsDir, config) {
    const output = [];
    Reflect.ownKeys(config).forEach(path => {
        const resources = [];
        const fullPath = assetsDir + path;
        if (!fs.existsSync(fullPath)) {
            console.error(`Directory ${fullPath} does not exist.`);
            return;
        }
        const dirListing = getAllFiles(fullPath);
        const outResourceFile = Reflect.get(config, path);
        const result = { resourceFile: outResourceFile, files: dirListing };
        output.push(result);
    });
    return output;
};

const registerResourcesForDownloadBuilder = function (description) {
    function createThisDotAddCall(path) {
        const thisDotAdd = ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'add');
        return ts.factory.createCallExpression(thisDotAdd, [], [ts.factory.createStringLiteral(path)]);
    }
    const methodBodyExpressions = [];
    description.files.forEach(path => {
        methodBodyExpressions.push(createThisDotAddCall(path));
    });
    const methodBody = ts.factory.createBlock(methodBodyExpressions, true);
    return ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createToken(ts.SyntaxKind.ProtectedKeyword)],
        undefined,
        'registerResourcesForDownload',
        undefined,
        [], [],
        ts.factory.createTypeReferenceNode('void', []),
        methodBody
    );
}
const textureFileTypes = ['png', 'jpg'];
/**
 * 
 * @param {string} resourceFilePath 
 * @returns 
 */
const propertyBuilder = function (resourceFilePath) {
    const propertyIdentifier = ts.factory.createIdentifier(resourceFilePath.replace(new RegExp('[/.-]', 'g'), '_'));
    const fileExtension = resourceFilePath.split('.')[1];
    let resourceTypeValue = 'Texture';
    if (!textureFileTypes.includes(fileExtension)) {
        resourceTypeValue = 'ILoaderResource';
    }
    const propertyType = ts.factory.createTypeReferenceNode(resourceTypeValue, []);
    const thisDotTexture = ts.factory.createPropertyAccessExpression(ts.factory.createThis(), resourceTypeValue === 'Texture' ? 'texture' : 'resource');
    const thisDotTextureCall = ts.factory.createCallExpression(thisDotTexture, [], [ts.factory.createStringLiteral(resourceFilePath)]);
    const returnStatement = ts.factory.createReturnStatement(thisDotTextureCall);
    const propertyBody = ts.factory.createBlock([returnStatement], true);
    return ts.factory.createGetAccessorDeclaration(
        undefined,
        [ts.factory.createToken(ts.SyntaxKind.PublicKeyword)],
        propertyIdentifier,
        [],
        propertyType,
        propertyBody
    );
}

const importsBuilder = function () {
    const importFromPixi = ts.factory.createImportClause(false,
        undefined,
        ts.factory.createNamedImports([ts.factory.createIdentifier('Texture'), ts.factory.createIdentifier('ILoaderResource')])
    );
    const importFromBaseResourcePackage = ts.factory.createImportClause(false,
        undefined,
        ts.factory.createNamedImports([ts.factory.createIdentifier('BaseResourcesPackage')])
    );
    return [
        ts.factory.createImportDeclaration([], [], importFromPixi, ts.factory.createStringLiteral('pixi.js')),
        ts.factory.createImportDeclaration([], [], importFromBaseResourcePackage, ts.factory.createStringLiteral('../../../../resources/BaseResourcesPackage')),
    ];
}

const classBuilder = function (description) {
    const thingImExtending = ts.factory.createIdentifier('BaseResourcesPackage');
    const thingImExtendingAsAnExpression = ts.factory.createExpressionWithTypeArguments(thingImExtending);
    const heritageClause = ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [thingImExtendingAsAnExpression]);
    const className = description.resourceFile.split('/').pop().split('.')[0];
    const resources = description.files;
    const classNameIdentifier = ts.factory.createIdentifier(className);
    const classBody = [];
    description.files.forEach(resourceFilePath => {
        classBody.push(propertyBuilder(resourceFilePath));
    });
    classBody.push(registerResourcesForDownloadBuilder(description));

    return ts.factory.createClassDeclaration(
        importsBuilder(),
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        classNameIdentifier,
        undefined,
        [heritageClause],
        classBody
    );
};

const createPackageFile = function (description) {
    const sourceFileName = description.resourceFile;
    const resultFile = ts.createSourceFile(sourceFileName, "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const result = printer.printNode(ts.EmitHint.Unspecified, classBuilder(description), resultFile);
    const file = fs.openSync(sourceFileName, 'w');
    fs.writeFileSync(file, result);
};

const assetsDir = "assets/";
const config = {
    "start": "src/by/zimad/testproject/scene/startScene/resources/StartSceneResourcesPackage.ts",
    "game": "src/by/zimad/testproject/scene/gameScene/resources/GameSceneResourcesPackage.ts",
    "preloader": "src/by/zimad/testproject/scene/preloaderScene/resources/PreloaderSceneResourcesPackage.ts"
};

const result = prepareLinks(assetsDir, config);
result.forEach(description => {
    createPackageFile(description);
});