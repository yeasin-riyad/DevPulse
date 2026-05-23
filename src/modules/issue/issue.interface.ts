export type IssueType =
  | "bug"
  | "feature_request";

export type IssueStatus =
  | "open"
  | "in_progress"
  | "resolved";

export interface IIssue {
  id?: number;
  title: string;
  description: string;
  type: IssueType;
  status?: IssueStatus;
  reporter_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type IssueSort =
  | "newest"
  | "oldest";

  export interface IReporter {
  id: number;
  name: string;
  role: string;
}

export interface IIssueWithReporter
  extends IIssue {
  reporter?: IReporter;
}

export interface IGetIssuesQuery {
  sort?: IssueSort;
  type?: IssueType;
  status?:IssueStatus;
}