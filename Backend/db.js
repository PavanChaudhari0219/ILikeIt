pool.query(
  "SELECT NOW()",
  (err, result) => {
    if (err) {
      console.error("Database connection failed:");
      console.error(err);   // <-- print the full error
    } else {
      console.log("✅ Database Connected!");
      console.log(result.rows[0]);
    }
  }
);