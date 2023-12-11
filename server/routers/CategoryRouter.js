const express = require("express");
const router = express.Router();

const { db, genid } = require("../db/DbUtils");

// 新增
// 新增前应该查看列表中是否有，有不添加，没有添加
router.post("/_token/add", async (req, res) => {
  let { name } = req.body;

  const inquire_sql = "select * from `category` where `name` = ?";
  let { err, rows } = await db.async.all(inquire_sql, [name]);
  console.log(err, rows, rows?.length);

  if (err == null && rows?.length == 0) {
    const insert_sql = "INSERT INTO `category` (`id`, `name`) VALUES (?,?)";
    let { err, rows } = await db.async.run(insert_sql, [genid.NextId(), name]);

    if (err == null) {
      res.send({
        code: 200,
        msg: "添加成功",
      });
    } else {
      res.send({
        code: 500,
        msg: "添加失败" + err,
      });
    }
  } else {
    res.send({
      code: 500,
      msg: "分类已存在",
    });
  }
});

// 删除 /category/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM `category` WHERE `id` = ?";
  let { err, rows } = await db.async.run(delete_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败" + err,
    });
  }
});
// 修改
router.put("/_token/update", async (req, res) => {
  let { id, name } = req.body;
  const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ?";
  let { err, rows } = await db.async.run(update_sql, [name, id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败" + err,
    });
  }
});
// 列表
router.get("/list", async (req, res) => {
  let { err, rows } = await db.async.all("select * from `category`", []);

  if (err == null) {
    res.send({
      code: 200,
      msg: "请求成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "请求失败" + err,
    });
  }
});

module.exports = router;
