import Cors from 'cors';

function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result)
                }
                return resolve(result)
            })
        })
}

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET and OPTIONS
        methods: ['GET', 'OPTIONS'],
    })
)

export default async function handler(req, res) {

    // Run cors
    await cors(req, res)

    res.status(200).json({ value: Math.floor(Math.random()*100) });
}
