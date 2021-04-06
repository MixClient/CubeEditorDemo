import { EditorData } from "./Data";
import cubeUrl from "../../assets/cube.png";
import { LoadingScreen } from "./LoadingScreen";

// 8个颜色块
export enum BlockColor {
    None = 0, // 没有选择块时，为选择模式，有颜色块时为创建模式
    Green,
    Black,
    Blue,
    Orange,
    Purple,
    Red,
    White,
    Yellow
}

// 错误标志
export enum EditorError {
    Ok,
    BeyondBorders = 1,
    Intersects = 2,
}

export declare type Nullable<T> = T | null;

// 编辑器
export class Editor {
    private static _instance: Editor;

    // 单例
    public static get Instance(): Editor { return Editor._instance; }

    // 当前选择的块颜色（8类,如果为0则是选择模式）
    public set Color(value: BlockColor) { this._color = value; }
    public get Color(): BlockColor { return this._color; }

    // 裁切状态
    public set CropState(value: boolean) { this._cropState = value; }
    public get CropState(): boolean { return this._cropState; }

    // 设置场景颜色(TODO)
    public set SceneColor(value: string) { }
    // 设置地面颜色(TODO)
    public set GroundColor(value: string) { }

    // 设定范围
    public get Range(): number { return 21; }
    public set Range(value: number) { }

    // 是否为3D相机视角
    public set Camera3DFlag(value: boolean) {}

    // 当前是否错误
    public get Error(): EditorError { return this._error; }

    // 构造函数()
    constructor(private canvasElement: string,
        private onBlockChange?: (nums: Array<number>) => void,
        private onSelected?: (move: boolean, rotate: boolean) => void,
        private onScreenShot?: (id: string, name?: string, data?: string) => void,
        private onUndoRedo?: (undo: boolean, redo: boolean) => void,
        private onModelChange?: (nums: Map<string, number>) => void) {
        Editor._instance = this;

        var canva = document.getElementById(canvasElement) as HTMLCanvasElement;
        // do something

        // 当块数变更时会回调
        if (this.onBlockChange)
            this.onBlockChange([1,2,3,4,5,6,7,8]);

        // 当选择变更时会回调(当选择的是模型时可旋转，当选择的是块时不能旋转)
        if (this.onSelected)
            this.onSelected(true, true);

        // demo
        this._loading = new LoadingScreen(canva)
        LoadingScreen.DefaultLogoUrl = cubeUrl;

        this._loading.displayLoadingUI();

        setTimeout(() => {
            this._loading?.hideLoadingUI();
        }, 1000);
    }

    // 初始化编辑器
    public async initialize(): Promise<void> { await this.initializeScene(); }

    // (关闭编辑器时)释放资源
    public Dispose() { }

    // (UI界面调用)开始弹出截图界面，当前有错时，不能裁切
    public ClickCrop(): boolean {
        if (this.Error == EditorError.Ok) {
            this.CropState = true;

            { // 模拟回调

                if (this.onScreenShot)
                    this.onScreenShot("1", "1_0_0_0_ff0000_ffffff.png", "screen data");

                this.CropState = false;
            }
        }

        return (this.Error == EditorError.Ok);
    }

    // (UI界面调用)旋转(dir[1,2,3分别代表x,y,z]，forword[1,-1代表正向反向])
    public Rotate(dir: number, forword: number = 1) { }

    // (UI界面调用)移动(dir[1,2,3分别代表x,y,z]，forword[1,-1代表正向反向步长])
    public Move(dir: number, forword: number = 1) { }

    // (UI界面调用)删除
    public Delete() { }

    // (UI界面调用)自动居中
    public AutoCenter() { }

    // (UI界面调用)镜头复位
    public ResetCamera() { }

    // (UI界面操作)倒退
    public Undo() { }

    // (UI界面操作)前进
    public Redo() { }

    // (UI界面调用)引入参考模型()
    public ImportRefModel(id: string, data: string /* ref ModelData */) {
        // 模拟编辑过了
        localStorage.setItem(`${this._id}.qumeta`, "data");
    }

    // (UI界面调用)当存在本地缓存时打开图纸编辑
    public LoadFromCache(id: string, name: Nullable<string> , data: EditorData, models?: Map<string, string>): boolean { return true; }

    // (UI界面调用)打开图纸编辑
    public Load(id: string, name: Nullable<string>, data?: string /* ref EditorData */, models?: Map<string, string>) { this._id = id; }

    // 保存图纸时及上链时保存获得数据
    public GetData(flag: boolean = false): Nullable<EditorData> { return null }

    // 导出图纸信息
    public ExportEditorData(): string { return ""; }

    // 导出全部格子信息
    public ExportAllBlockData(): string { return ""; }

    public ExportSelectedBlockData(): string { return ""; }

    // (UI界面调用)打开图纸预览
    public Preview(id: string, name: string, data: string /* ref EditorData */) { this._id = id; }

    // (功能调用)图纸是否存在缓存
    public GetCached(id: string): EditorData | null {
        var data = localStorage.getItem(`${this._id}.qumeta`);
        if (data == null)
            return null;

        var obj = JSON.parse(data) as EditorData;
        return obj;
    }

    // 导出图纸区块链保存信息
    public ExportChainEditorData(): { coordinates: ArrayBuffer, cites: Array<ArrayBuffer> } {
        var cites = [new ArrayBuffer(10)];
        return { coordinates: new ArrayBuffer(10), cites: cites };
    }

    // 保存时调用(flag 保存图纸时为true，上链时为false)
    public Serialize(flag: boolean = false): { id: string, buffer: ArrayBuffer, data: string } {
        // 保存清除 localStorage
        localStorage.removeItem(`${this._id}.qumeta`);

        // id 图纸id
        // buffer 链上保存的二进制格式(上链)
        // data 服务器保存的字符串格式（保存图纸）
        return { id: "", buffer: new ArrayBuffer(0), data: "" };
    }

    private async initializeScene(): Promise<void> {
        // my code
    }

    private _id: string = "";
    private _color: BlockColor = BlockColor.None;
    private _cropState: boolean = false;
    private _error: EditorError = EditorError.Ok;

    private _loading: Nullable<LoadingScreen> = null;
}