import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Hello from Hono on Cloudflare Workers!'
  })
})

app.get('/hello/:name', (c) => {
  const name = c.req.param('name')

  return c.json({
    message: `Hello ${name}`
  })
})

app.post('/echo', async (c) => {
  const body = await c.req.json()

  return c.json({
    received: body
  })
})

/**
 * New API to read data from D1 database
 */
app.get('/users', async (c) => {
  try {
    const result = await c.env.DB
      .prepare(`SELECT name, location FROM "test-table"`)
      .all()

    return c.json({
      success: true,
      data: result.results
    })
  } catch (err) {
    return c.json(
      {
        success: false,
        error: String(err)
      },
      500
    )
  }
})

export default app