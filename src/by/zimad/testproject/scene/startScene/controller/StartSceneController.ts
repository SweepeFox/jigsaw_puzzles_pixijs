import type { ViewableOperationControls } from "../../../../scene/viewable/Viewable";

export class StartSceneController {
    private readonly operationControls: ViewableOperationControls<void>;

    public constructor(operationControls: ViewableOperationControls<void>, ) {
        this.operationControls = operationControls;
    }

    public onStart(): void {
        this.operationControls.complete(); 
    }
}