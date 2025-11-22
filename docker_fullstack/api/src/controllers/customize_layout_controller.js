/*import { getLayoutByGroup, saveLayoutForGroup } from "../models/customize_layout_model";

export async function getGroupLayout(req, res, next) {
    try {
        const groupId = req.params.groupId;
        const layout = await getLayoutByGroup(groupId);
        if (!layout) {
            return res.status(404).json({ error: "Layout not found" });
        }
        return res.json({ layout });
    } catch (err) {
        next(err);
    }
}
export async function postGroupLayout(req, res, next) {
    try {
        const groupId = req.params.groupId;
        const { layout } = req.body;
        if (!layout || !Array.isArray(layout)) {
            return res.status(400).json({ error: "Invalid layout data" });
        }
        await saveLayoutForGroup(groupId, layout);
        return res.status(200).json({ message: "Layout saved successfully" });
    } catch (err) {
        next(err);
    }
}*/ 
