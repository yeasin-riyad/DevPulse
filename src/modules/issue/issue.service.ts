import { pool } from "../../db";

import { IIssue } from "./issue.interface";

export const createIssueIntoDB = async (
  payload: IIssue
) => {

  const result = await pool.query(
    `
    INSERT INTO issues
    (
      title,
      description,
      type,
      reporter_id
    )

    VALUES
    ($1, $2, $3, $4)

    RETURNING *
    `,
    [
      payload.title,
      payload.description,
      payload.type,
      payload.reporter_id,
    ]
  );

  return result;
};