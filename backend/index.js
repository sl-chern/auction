import app from './express/app.js'
import sequelize from './sequelize/index.js'
import config from "config"
import schedule from "node-schedule"
import checkOrders from './express/helpers/order.job.js'
import fillRegistry from './express/helpers/fillRegistry.js'

const PORT = config.get("port") || 5000

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`)
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!')
	} catch (error) {
		console.log('Unable to connect to the database:')
		console.log(error.message)
		process.exit(1)
	}
}

const init = async () => {
	await assertDatabaseConnectionOk()

	schedule.scheduleJob("* 0 0 * * *", checkOrders)

	app.listen(PORT, async () => {
		console.log(`Express server started on port ${PORT}`)
		//fillRegistry(app)
	})
}

init()