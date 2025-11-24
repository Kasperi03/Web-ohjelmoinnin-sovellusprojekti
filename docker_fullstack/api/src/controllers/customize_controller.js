import { getLayoutByGroup, saveLayoutForGroup } from "../models/customize_model.js";

export async function getGroupLayout(req, res, next) {
    try {
        const groupId = req.params.groupId;
        const layout = await getLayoutByGroup(groupId);
        if (!layout) {
            return res.status(404).json({ error: "Layout not found" });
        }
        return res.json(layout);
    } catch (err) {
        next(err);
    }
}

export async function putGroupLayout(req, res, next) {
    try {
        const groupId = req.params.groupId;
        const { layout } = req.body;
        if (!layout || !Array.isArray(layout)) {
            return res.status(400).json({ error: "Invalid layout data" });
        }

        const updatedGroup = await saveLayoutForGroup(groupId, layout);
        if (!updatedGroup) {
            return res.status(404).json({ error: "Group not found" });
        }

        return res.status(200).json({ message: "Layout saved successfully", layout: updatedGroup.layout });
    } catch (err) {
        next(err);
    }
}

