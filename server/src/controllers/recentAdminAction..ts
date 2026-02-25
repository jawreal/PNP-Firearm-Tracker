import type { Request, Response, NextFunction } from "express";

const RecentAdminAction = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mockupData = [
      {
        description: "**@jd-admin** updated a firearm record **#BR-21314**",
        createdAt: "2024-01-10T08:30:00Z",
        updatedAt: "2024-01-10T09:00:00Z",
      },
      {
        description:
          "**@msantos** registered a new user account **@new-user01**",
        createdAt: "2024-01-11T10:15:00Z",
        updatedAt: "2024-01-14T11:30:00Z",
      },
      {
        description: "**@creyes-mod** deleted firearm record **#FA-2023-089**",
        createdAt: "2024-01-12T14:45:00Z",
        updatedAt: "2024-01-12T15:00:00Z",
      },
      {
        description: "**@alim** logged into the system",
        createdAt: "2024-01-13T07:20:00Z",
        updatedAt: "2024-01-14T11:30:00Z",
      },
      {
        description:
          "**@mcruz-admin** registered a new firearm record **#FA-2024-014**",
        createdAt: "2024-01-14T11:05:00Z",
        updatedAt: "2024-01-14T11:30:00Z",
      },
    ];
    res.status(201).json(mockupData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default RecentAdminAction;
