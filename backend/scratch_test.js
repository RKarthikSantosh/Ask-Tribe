const db = require('./src/config/db.config');
const { TagsModel, PostsModel } = require('./src/models');
const Sequelize = require('sequelize');

(async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    const queryResult = await TagsModel.findAll({
      distinct: true,
      attributes: [
        'id',
        'tagname',
        'description',
        [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'posts_count'],
        'created_at',
      ],
      include: {
        model: PostsModel,
        attributes: [],
      },
      group: ['tags.id'],
      order: [[Sequelize.col('posts_count'), 'DESC']],
    });
    console.log('Success:', queryResult);
  } catch (err) {
    console.error('SQL ERROR:', err);
  } finally {
    process.exit(0);
  }
})();
