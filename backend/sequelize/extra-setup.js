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

    bet.addHook("beforeCreate", async (bet) => {
        const userInBet = await user.findOne({
            where: {
                id: bet.user_id
            }
        })

        if(userInBet.punishment_points > 3)
            throw new Error("Ban", {cause: "bet error"})

        const productInBet = await product.findOne({
            where: {
                id: bet.product_id
            }
        })

        if(productInBet.cur_price >= bet.price)
            throw new Error("Price in bet lower than current price of product", {cause: "bet error"})

        await product.update({
            cur_price: bet.price
        }, 
        {
            where: {
                id: bet.product_id
            }
        })
    })

    bet.beforeBulkDestroy(async (betObj) => {
        const deletedBet = await bet.findOne({
            where: {
                id: betObj.where.id
            },
        })

        let biggestBet = await bet.findAll({
            where: {
                product_id: deletedBet.product_id
            },
            order: [
                ["price", "DESC"]
            ]
        })

        biggestBet = biggestBet[1]

        if(biggestBet) {
            await product.update({
                cur_price: biggestBet.price
            },
            {
                where: {
                    id: deletedBet.product_id
                }
            })
        }
        else {
            const productObj = await product.findOne({
                where: {
                    id: deletedBet.product_id
                }
            })

            await product.update({
                cur_price: productObj.start_price
            },
            {
                where: {
                    id: deletedBet.product_id
                }
            })
        }
    })
}

export default applyExtraSetup