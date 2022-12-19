const insertData = async (sequelize) => {
    const findByName = async (model, name, key) => {
        let item = await model.findOne({
            where: {
                name: name
            }
        })
        return item[key]
    }

    const { bet, category, delivery, order, post, product, review, role, token, user } = sequelize.models

    await role.create({
        name: "user"
    })
    await role.create({
        name: "admin"
    })

    await post.create({
        name: "Нова пошта"
    })
    await post.create({
        name: "Укрпошта"
    })

    await category.create({
        name: "Антикваріат"
    })
    await category.create({
        name: "Комп'ютерна техніка"
    })
    await category.create({
        name: "Телефони і смартфорни"
    })
    await category.create({
        name: "Побутова техніка"
    })
    await category.create({
        name: "Транспорт"
    })

    await category.create({
        name: "Нумізматика",
        parent_category: await findByName(category, "Антикваріат", "id")
    })
    await category.create({
        name: "Книги",
        parent_category: await findByName(category, "Антикваріат", "id")
    })
    await category.create({
        name: "Платівки",
        parent_category: await findByName(category, "Антикваріат", "id")
    })
    await category.create({
        name: "Зброя",
        parent_category: await findByName(category, "Антикваріат", "id")
    })

    await category.create({
        name: "ПК",
        parent_category: await findByName(category, "Комп'ютерна техніка", "id")
    })
    await category.create({
        name: "Ноутбуки",
        parent_category: await findByName(category, "Комп'ютерна техніка", "id")
    })
    await category.create({
        name: "Плантшети",
        parent_category: await findByName(category, "Комп'ютерна техніка", "id")
    })
    await category.create({
        name: "Комплектуючі",
        parent_category: await findByName(category, "Комп'ютерна техніка", "id")
    })

    await category.create({
        name: "Телефони",
        parent_category: await findByName(category, "Телефони і смартфорни", "id")
    })
    await category.create({
        name: "Смартфони",
        parent_category: await findByName(category, "Телефони і смартфорни", "id")
    })
    await category.create({
        name: "Аксесуари",
        parent_category: await findByName(category, "Телефони і смартфорни", "id")
    })
    await category.create({
        name: "Комплектуючі",
        parent_category: await findByName(category, "Телефони і смартфорни", "id")
    })

    await category.create({
        name: "ТВ, Відео",
        parent_category: await findByName(category, "Побутова техніка", "id")
    })
    await category.create({
        name: "Аудіотехніка",
        parent_category: await findByName(category, "Побутова техніка", "id")
    })
    await category.create({
        name: "Техніка для кухні, дому",
        parent_category: await findByName(category, "Побутова техніка", "id")
    })

    await category.create({
        name: "Автомобілі",
        parent_category: await findByName(category, "Транспорт", "id")
    })
    await category.create({
        name: "Мотоцикли",
        parent_category: await findByName(category, "Транспорт", "id")
    })
    await category.create({
        name: "Велосипеди",
        parent_category: await findByName(category, "Транспорт", "id")
    })

    await user.create({
		first_name: "В'ячеслав",
		last_name: "Черногор",
        phone: "+380997062027",
        email: "ivanov228.dm@gmail.com",
        password: "qwertyuiop",
        role_id: 2,
        punishment_points: 0,
    })

    await user.create({
		first_name: "В'ячеслав",
		last_name: "Черногор",
        phone: "+380997062027",
        email: "ivanov228dm@gmail.com",
        password: "qwertyuiop",
        role_id: 2,
        punishment_points: 0,
    })

    product.create({
		name: "Книга 1",
        start_price: 250,
		cur_price: 250,
		description: "qwertyu",
		image: "qwertyu",
		location: "Київ",
		start_date: new Date(),
		end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        user_id: 1,
        category_id: await findByName(category, "Книги", "id"),
        is_archived: false
    })

    product.create({
		name: "Книга 2",
        start_price: 450,
		cur_price: 450,
		description: "qwertyu",
		image: "qwertyu",
		location: "Київ",
		start_date: new Date(new Date().setDate(new Date().getDate() + 1)),
		end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        user_id: 1,
        category_id: await findByName(category, "Книги", "id"),
        is_archived: false
    })

    product.create({
		name: "Книга 4",
        start_price: 450,
		cur_price: 450,
		description: "qwertyu",
		image: "qwertyu",
		location: "Київ",
		start_date: new Date(new Date().setDate(new Date().getDate() - 20)),
		end_date: new Date(new Date().setDate(new Date().getDate() - 10)),
        user_id: 1,
        category_id: await findByName(category, "Книги", "id"),
        is_archived: true
    })

    product.create({
		name: "Ноутбук 1",
        start_price: 350,
		cur_price: 350,
		description: "qwertyu",
		image: "qwertyu",
		location: "Київ",
		start_date: new Date(new Date().setDate(new Date().getDate() - 10)),
		end_date: new Date(new Date().setDate(new Date().getDate() - 4)),
        user_id: 1,
        category_id: await findByName(category, "Ноутбуки", "id"),
        is_archived: false
    })
}

export default insertData