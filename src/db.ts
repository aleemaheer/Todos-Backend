import * as Pool from "pg";

export const pool = new Pool.Pool({
    user: 'postgres',
    password: 'htgrj8r1',
    host: 'aleemaheer',
    port: 5432,
    database: 'todosbackend'
});

// async function readData() {
//     try {
//         const data = await pool.query("SELECT * FROM todos;");
//         console.table(data.rows);
//     } catch(err) {
//         console.log(err);
//     }
// }

// readData();

//module.exports = pool;