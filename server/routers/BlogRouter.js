const express = require("express");
const router = express.Router();

const { db, genid } = require("../db/DbUtils");

// 新增
// 新增前应该查看列表中是否有，有不添加，没有添加
router.post("/_token/add", async (req, res) => {
  let { title, categoryId, content } = req.body;
  var id = genid.NextId();
  var create_time = new Date().getTime();

  const insert_sql =
    "INSERT INTO `blog` (`id`, `title`, `category_id`, `content`, `create_time`) VALUES (?,?,?,?,?)";
  let params = [id, title, categoryId, content, create_time];
  let { err, rows } = await db.async.run(insert_sql, params);

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
});

// 删除 /blog/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM `blog` WHERE `id` = ?";
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
  let { id, title, categoryId, content } = req.body;
  const update_sql =
    "UPDATE `blog` SET `title` = ?, `category_id` = ?, `content` = ? WHERE `id` = ?";
  let params = [title, categoryId, content, id];

  let { err, rows } = await db.async.run(update_sql, params);

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
// 查询+分页
router.get("/search", async (req, res) => {
  let { keyword, categoryId, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? 10 : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  keyword = keyword == null ? "" : keyword;

  let params = [];
  let whereSqls = [];

  if (categoryId != 0) {
    whereSqls.push(" `category_id` = ? ");
    params.push(categoryId);
  }

  if (keyword != "") {
    whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ");
    params.push("%" + keyword + "%");
    params.push("%" + keyword + "%");
  }

  let whereSqlStr = "";
  if (whereSqls.length) {
    whereSqlStr = " WHERE " + whereSqls.join(" AND ");
  }

  //   查分页
  let searchSql =
    // " SELECT * FROM `blog` " +
    " SELECT `id`, `category_id`, `title`, `create_time`, substr(`content`, 0,100) AS `content` FROM `blog` " +
    whereSqlStr +
    " ORDER BY `create_time` DESC LIMIT ?,? ";
  let searchSqlParmas = params.concat([(page - 1) * pageSize, pageSize]);

  // 查询数据总数
  let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
  let searchCountParmas = params;

  // 分页数据
  let searchResult = await db.async.all(searchSql, searchSqlParmas);
  let countResult = await db.async.all(searchCountSql, searchCountParmas);

  console.log(searchResult, countResult);

  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "请求成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        rows: searchResult.rows,
        count: countResult.rows[0].count,
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "请求失败" + err,
    });
  }
});

// 查询单篇文章
router.get("/detail", async (req, res) => {
  let { id } = req.query;
  let detail_sql = " SELECT * FROM `blog` WHERE `id` = ? ";
  let { err, rows } = await db.async.all(detail_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "获取成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "获取失败" + err,
    });
  }
});
module.exports = router;
