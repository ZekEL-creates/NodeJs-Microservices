export type Workflow = {
  id: string;
  task_id: string;
  event_type: string;
  message: string;
  created_by: string;
  created_at: Date;
};

export type PublishedData = {
  eventType?: string;
  taskId?: string;
  message?: string;
  userId?: string;
};
