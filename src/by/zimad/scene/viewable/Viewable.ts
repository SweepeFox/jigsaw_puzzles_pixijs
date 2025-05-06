import { BaseView } from "./BaseView";

export class Viewable<TResult> {
	public readonly operation:Promise<TResult>;
	protected operationControls:ViewableOperationControls<TResult>;

	public constructor() {
		this.operation = new Promise<TResult>((resolve, reject) => {
			this.operationControls = new ViewableOperationControls<TResult>(resolve, reject);
		});
	}

	public get view(): BaseView {
		return this._view;
	}

	protected set view(v: BaseView) {
		this._view = v;
	}

	private _view: BaseView;

	public onStartAllowed(): void {
		if (this.view == null) {
			throw new Error('Failed to call onStartAllowed. View not ready yet and is null.');
		}
		this.view.start();
	}
}

export class ViewableOperationControls<TResult> {
	public readonly complete: (result: TResult) => void;
	public readonly error: (reason: any) => void;

	public constructor(complete:(result: TResult) => void, error:(reason: any) => void) {
		this.complete = complete;
		this.error = error;
	}
}
