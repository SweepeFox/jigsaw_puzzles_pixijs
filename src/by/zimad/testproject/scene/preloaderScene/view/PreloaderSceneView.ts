import type { PreloaderSceneController } from "../controller/PreloaderSceneController";
import type { ViewableOperationControls } from "../../../../scene/viewable/Viewable";
import type { ResourceManager } from "../../../../resources/ResourceManager";
import type { ResourcesConfigModel } from "../model/ResourcesConfigModel";

import { PreloaderConfigModel } from "../model/PreloaderConfigModel";
import { BaseView } from "../../../../scene/viewable/BaseView";

export class PreloaderSceneView extends BaseView {
    private controller: PreloaderSceneController;
    private resourceManager: ResourceManager;
    private operationControls: ViewableOperationControls<PreloaderConfigModel>;

    public constructor(controller: PreloaderSceneController, resourceManager: ResourceManager, operationControls: ViewableOperationControls<PreloaderConfigModel>) {
        super();
        this.controller = controller;
        this.resourceManager = resourceManager;
        this.operationControls = operationControls;
        this.start();
    }

    public start(): void {
        this.controller.load(this.resourceManager).then((resourcesConfigModel: ResourcesConfigModel) => {
            const preloaderConfigModel = new PreloaderConfigModel();
            preloaderConfigModel.resources = resourcesConfigModel;
            this.operationControls.complete(preloaderConfigModel); 
        });
    }
}