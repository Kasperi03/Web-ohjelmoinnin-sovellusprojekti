import { getAll, getOne, addOne, updateOne, deleteOne } from "../models/group_model.js";

export async function getGroups(req, res, next) {
  try {
    const groups = await getAll();
    res.json(groups);
  } catch (err) {
    next(err);
  }
}

export async function getGroup(req, res, next) {
  try {
    const group = await getOne(req.params.id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
}

export async function addGroup(req, res, next) {
  try {
    const { name } = req.body;
    const ownerId = req.user.account_id; // <-- REQUIRED

    if (!name) {
      return res.status(400).json({ error: "Group name required" });
    }

    const response = await addOne(ownerId, name);
    res.status(201).json(response);

  } catch (err) {
    next(err);
  }
}

export async function updateGroup(req, res, next) {
  try {
    const { name } = req.body;
    const response = await updateOne(req.params.id, name);

    if (!response) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function deleteGroup(req, res, next) {
  try {
    const response = await deleteOne(req.params.id);

    if (!response) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: "Group deleted", group: response });

  } catch (err) {
    next(err);
  }
}
