
// 格子信息(x,y,z,color颜色)
declare class Block {
    constructor(x: number, y: number, z: number, c: number);
}

// 坐标信息(x,y,z)
declare class Vector3 {
    constructor(x: number, y: number, z: number);
}

// 参考模型信息
export class ModelData {
    public ID: string = ""; // 模型id
    public Blocks: Array<Block> = []; // 格子数据

    constructor(id: string, blocks: Array<Block>) {
        this.ID = id;
        this.Blocks = blocks;
    }
}

// 参考模型数据
export class RefModelData {
    public ID: string = "";
    public Position: Vector3;
    public Rotation: Vector3;

    constructor(id: string, position: Vector3, rotation: Vector3) {
        this.ID = id;
        this.Position = position;
        this.Rotation = rotation;
    }
}

// 编辑器数据
export class EditorData {
    public ID: string = ""; // 模型id
    public Range: number = 0;
    public Blocks: Array<Block> = [];
    public Refs: Array<RefModelData> = [];
}
