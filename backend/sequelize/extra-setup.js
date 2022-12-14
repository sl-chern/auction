const applyExtraSetup = (sequelize) => {
    
    const { bet, category, delivery, order, post, product, review, role, token, user } = sequelize.models

    //Category relations
    category.hasMany(category, {
        foreignKey: 'parent_category'
    })
    category.belongsTo(category, {
        foreignKey: 'parent_category'
    })

    category.hasMany(product, {
        foreignKey: 'category_id'
    })
    product.belongsTo(category, {
        foreignKey: 'category_id'
    })

    //Product relations
    product.hasMany(bet, {
        foreignKey: 'product_id'
    })
    bet.belongsTo(product, {
        foreignKey: 'product_id'
    })

    product.hasMany(order, {
        foreignKey: 'product_id'
    })
    order.belongsTo(product, {
        foreignKey: 'product_id'
    })

    //User relations
    user.hasMany(bet, {
        foreignKey: 'user_id'
    })
    bet.belongsTo(user, {
        foreignKey: 'user_id'
    })

    user.hasMany(product, {
        foreignKey: 'user_id'
    })
    product.belongsTo(user, {
        foreignKey: 'user_id'
    })

    user.hasMany(review, {
        foreignKey: 'seller_id'
    })
    review.belongsTo(user, {
        foreignKey: 'seller_id'
    })

    user.hasMany(review, {
        foreignKey: 'buyer_id'
    })
    review.belongsTo(user, {
        foreignKey: 'buyer_id'
    })

    user.hasMany(order, {
        foreignKey: 'user_id'
    })
    order.belongsTo(user, {
        foreignKey: 'user_id'
    })

    user.hasMany(token, {
        foreignKey: 'user_id'
    })
    token.belongsTo(user, {
        foreignKey: 'user_id'
    })

    //Role relations
    role.hasMany(user, {
        foreignKey: 'role_id'
    })
    user.belongsTo(role, {
        foreignKey: 'role_id'
    })

    //Delivery relations
    delivery.hasOne(order, {
        foreignKey: 'delivery_id'
    })
    order.belongsTo(delivery, {
        foreignKey: 'delivery_id'
    })

    //Post relations
    post.hasMany(delivery, {
        foreignKey: 'post_id'
    })
    delivery.belongsTo(post, {
        foreignKey: 'post_id'
    })
}

export default applyExtraSetup