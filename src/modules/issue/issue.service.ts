import { pool } from "../../db";

import { IIssue,IGetIssuesQuery,IIssueWithReporter, } from "./issue.interface";

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




export const getAllIssuesFromDB = async (
  filters: IGetIssuesQuery
): Promise<IIssueWithReporter[]> => {

  let query = `
    SELECT *
    FROM issues
    WHERE 1=1
  `;

  const values: string[] = [];

  // Type Filter
  if (filters.type) {

    values.push(filters.type);

    query += `
      AND type = $${values.length}
    `;
  }

  // Status Filter
  if (filters.status) {

    values.push(filters.status);

    query += `
      AND status = $${values.length}
    `;
  }

  // Sorting
  if (filters.sort === "oldest") {

    query += `
      ORDER BY created_at ASC
    `;

  } else {

    query += `
      ORDER BY created_at DESC
    `;
  }

  // Fetch Issues
  const issuesResult = await pool.query(
    query,
    values
  );

  const issues = issuesResult.rows;

  // Extract Reporter IDs
  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    ),
  ];

  // Fetch Reporters
  let reporters = [];

  if (reporterIds.length > 0) {

    const reportersResult =
      await pool.query(
        `
        SELECT
          id,
          name,
          role
        FROM users
        WHERE id = ANY($1)
        `,
        [reporterIds]
      );

    reporters = reportersResult.rows;
  }

  // Merge Reporter
  const finalIssues = issues.map(
    (issue) => {

      const reporter = reporters.find(
        (user) =>
          user.id === issue.reporter_id
      );
      delete issue.reporter_id;

      return {
        ...issue,
        reporter,
      };
    }
  );

  return finalIssues;
};

export const getSingleIssueFromDB = async (
  id: number
) => {

  // Fetch Issue
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    return null;
  }

  // Fetch Reporter
  const reporterResult =
    await pool.query(
      `
      SELECT
        id,
        name,
        role
      FROM users
      WHERE id = $1
      `,
      [issue.reporter_id]
    );

  const reporter =
    reporterResult.rows[0];

    // delete issue.reporter_id;
  // Merge Reporter
  const finalIssue = {
    ...issue,
    reporter,
  };

  return finalIssue;
};

export const updateIssueIntoDB = async (
  id: number,
  payload: Partial<IIssue>
) => {

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [
      payload.title,
      payload.description,
      payload.type,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteIssueFromDB = async (
  id: number
) => {

  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};