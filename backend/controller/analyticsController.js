import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";

export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const { range } = req.query;
  const days = range === "monthly" ? 30 : 7;
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const totalDoctors = await User.countDocuments({ role: "Doctor" });
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
  const acceptedAppointments = await Appointment.countDocuments({ status: "Accepted" });
  const rejectedAppointments = await Appointment.countDocuments({ status: "Rejected" });

  // Appointments per day (filtered by range)
  const appointmentsPerDay = await Appointment.aggregate([
    {
      $group: {
        _id: { $substr: ["$appointment_date", 0, 10] },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: days },
    { $project: { date: "$_id", count: 1, _id: 0 } },
  ]);

  // Department distribution
  const departmentStats = await Appointment.aggregate([
    {
      $group: {
        _id: "$department",
        count: { $sum: 1 },
      },
    },
    { $project: { department: "$_id", count: 1, _id: 0 } },
  ]);

  // Status breakdown
  const statusStats = [
    { status: "Pending", count: pendingAppointments },
    { status: "Accepted", count: acceptedAppointments },
    { status: "Rejected", count: rejectedAppointments },
  ];

  res.status(200).json({
    success: true,
    stats: {
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      acceptedAppointments,
      rejectedAppointments,
      appointmentsPerDay,
      departmentStats,
      statusStats,
    },
  });
});
