// 调试支持
//if (__Dev__) {}

import { Editor, BlockColor } from "./editor/Editor";

export const editorInit = async (): Promise<void> => {

    // Get the canvas element
    const editor = new Editor("renderCanvas", (num) => {
        // 界面更新块数num
        console.log("块num:" + num);
    }, (move, rotate) => {
        // 当前move是否可用
        // 当前rotate是否可用
        console.log("move:" + move + " rotate:" + rotate);
    }, (id, name, data) => {
        // id 图纸id
        // name 图纸名字(id_alpha_beta_radis_color1_color2.png)记录id，角度，颜色等信息做还原用
        // data 截屏数据，发送服务器
        if (data)
            console.log("截图：" + id + " " + name + " 完成");
        else
            console.log("截图：" + id + " 放弃");
    });

    await editor.initialize();
}

window.addEventListener("DOMContentLoaded", () => {
    editorInit().then(() => {
        window.addEventListener("keydown", (evt) => {
            // 调试信息
            console.log(evt.key);

            if (evt.key === "r") {
                // 重置镜头
                Editor.Instance.ResetCamera();
            }

            if (evt.key === "x") {
                // 点击剪切
                Editor.Instance.ClickCrop();
            }

            if (evt.key === "d") {
                // 删除
                Editor.Instance.Delete();
            }

            if (evt.key === ",") { // 旋转x
                Editor.Instance.Rotate(1, (evt.ctrlKey ? -1 : 1));
            } else if (evt.key === ".") { // 旋转y
                Editor.Instance.Rotate(2, (evt.ctrlKey ? -1 : 1));
            } else if (evt.key === "/") { // 旋转xz
                Editor.Instance.Rotate(3, (evt.ctrlKey ? -1 : 1));
            } else if (evt.key === "[") { // 移动x
                Editor.Instance.Move(1, (evt.ctrlKey ? -1 : 1));
            } else if (evt.key === "]") { // 移动y
                Editor.Instance.Move(2, (evt.ctrlKey ? -1 : 1));
            } else if (evt.key === "\\") { // 移动z
                Editor.Instance.Move(3, (evt.ctrlKey ? -1 : 1));
            }

            if ("12345678".indexOf(evt.key) >= 0) { // 颜色/参考模型选择(测试固定几个模型)
                Editor.Instance.Color = Number(evt.key);
            }

            if (evt.key === "0" || evt.key === "s") { // 进入选择模式
                Editor.Instance.Color = BlockColor.None;
            }

            if (evt.key === "a") {
                // 自动居中
                Editor.Instance.AutoCenter();
            }

            if (evt.key === "l") {
                // 是否有缓存，异常关闭时会有缓存，用户主动保存后，会删除缓存
                var cached = Editor.Instance.GetCached("1");

                // 有缓存从缓存装载
                if (cached != null) {
                    // cached.Refs
                    // 取出所有引用的模型后，装载
                    var refModels = new Map<string, string>();
                    //refModels.set("1", "1,1,1,A");
                    //refModels.set("2", "1,1,2,A1");

                    var flag = Editor.Instance.LoadFromCache("1", cached, refModels);
                    console.log(flag);
                } else {
                    // 没有缓存，则取引用模型的数据后，装载
                    var refModels = new Map<string, string>();
                    //refModels.set("1", "1,1,1,A");
                    //refModels.set("2", "1,1,2,A1");

                    // 有数据表示编辑，没有数据相当于新建
                    //var str = "1,1,2,A1";
                    var str = "";
                    Editor.Instance.Load("1", str, refModels);
                }
            }

            if (evt.key === "t") {
                // 序列化
                var data = Editor.Instance.GetData(true);
                if (data) {
                    console.log(data?.ID);
                    //data?.SerializeToBuffer();

                    data?.Refs.forEach(item => {
                        console.log("ref:" + item.ID);
                        // item.ID
                        //item.Position
                        //item.Rotation
                    });

                    // 存储到服务器,格子及引用信息
                    var workData = Editor.Instance.ExportEditorData();
                    console.log(workData);

                    // 服务器全部格子
                    var blockData = Editor.Instance.ExportAllBlockData();
                    // id --> string
                    console.log(data?.ID + ":全格子模型");
                    console.log(blockData);

                    // 保存的区块链信息
                    var buffer = Editor.Instance.ExportChainEditorData();
                    console.log(buffer.coordinates);
                    console.log(buffer.cites.length);
                }
            }

            if (evt.key === "e") { // 导出当前数据
                var eData = Editor.Instance.ExportSelectedBlockData();
                console.log(eData);
                //Meshes.Instance.ListJson[Editor.Instance.Color] = data;
            }

            if (evt.key === "q") { // 导入数据
                // demo 从服务器取得模型1的数据然后导出
                var id = "1";
                var qdata = "1,1,4,B1CD";
                Editor.Instance.ImportRefModel(id, qdata);
            }

            if (evt.key === "p") { // 预览数据(不能编辑)
                // demo 从服务器取得模型1的数据然后导出
                var id = "1"; //"chr_sword";
                var name = id + "_45_45_50_FFFFFF_FFFFFF";
                var pdata = "1,1,4,B1CD";
                Editor.Instance.Preview(id, name, pdata);
            }
        });

        // scene started rendering, everything is initialized
    });
});