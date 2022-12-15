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
        foreignKey: {
            name: 'category_id',
            allowNull: false
        }
    })
    product.belongsTo(category, {
        foreignKey: {
            name: 'category_id',
            allowNull: false
        }
    })

    //Product relations
    product.hasMany(bet, {
        foreignKey: {
            name: 'product_id',
            allowNull: false
        }
    })
    bet.belongsTo(product, {
        foreignKey: {
            name: 'product_id',
            allowNull: false
        }
    })

    product.hasMany(order, {
        foreignKey: {
            name: 'product_id',
            allowNull: false
        }
    })
    order.belongsTo(product, {
        foreignKey: {
            name: 'product_id',
            allowNull: false
        }
    })

    //User relations
    user.hasMany(bet, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    bet.belongsTo(user, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    user.hasMany(product, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    product.belongsTo(user, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    user.hasMany(review, {
        foreignKey: {
            name: 'seller_id',
            allowNull: false
        }
    })
    review.belongsTo(user, {
        foreignKey: {
            name: 'seller_id',
            allowNull: false
        }
    })

    user.hasMany(review, {
        foreignKey: {
            name: 'buyer_id',
            allowNull: false
        }
    })
    review.belongsTo(user, {
        foreignKey: {
            name: 'buyer_id',
            allowNull: false
        }
    })

    user.hasMany(order, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    order.belongsTo(user, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    user.hasMany(token, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })
    token.belongsTo(user, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    })

    //Role relations
    role.hasMany(user, {
        foreignKey: {
            name: 'role_id',
            allowNull: false
        }
    })
    user.belongsTo(role, {
        foreignKey: {
            name: 'role_id',
            allowNull: false
        }
    })

    //Delivery relations
    delivery.hasOne(order, {
        foreignKey: {
            name: 'delivery_id',
            allowNull: false
        }
    })
    order.belongsTo(delivery, {
        foreignKey: {
            name: 'delivery_id',
            allowNull: false
        }
    })

    //Post relations
    post.hasMany(delivery, {
        foreignKey: {
            name: 'post_id',
            allowNull: false
        }
    })
    delivery.belongsTo(post, {
        foreignKey: {
            name: 'post_id',
            allowNull: false
        }
    })
}

export default applyExtraSetup