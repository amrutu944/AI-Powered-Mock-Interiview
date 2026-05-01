import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";
import { BsFillAlarmFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

import { useAuth } from "../context/authContext";
import { useInterviewGoal } from "../hooks/useInterviewGoal";

export default function CountdownWidget({ iconOnly = false, compact = false }) {
  const { user, loading: authLoading } = useAuth();

  const {
    goal,                // 👈 single OR array (we'll handle both)
    loading: goalLoading,
    removeGoal,
  } = useInterviewGoal();

  const [dismissed, setDismissed] = useState(false);
  const [askDelete, setAskDelete] = useState(null);

  // 🔥 ALWAYS convert to array safely
  const goals = Array.isArray(goal)
    ? goal
    : goal
    ? [goal]
    : [];

  // ✅ Guard
  if (
    authLoading ||
    !user ||
    goalLoading ||
    goals.length === 0 ||
    dismissed
  ) {
    return null;
  }

  // 🔥 Process goals safely
  const upcoming = goals
    .map((g) => ({
      ...g,
      target: new Date(g.targetDate),
    }))
    .filter((g) => g.target > Date.now())
    .sort((a, b) => a.target - b.target);

  if (!upcoming.length) return null;

  // ================= ICON ONLY =================
  if (iconOnly) {
    return (
      <motion.div className="fixed bottom-6 right-6 z-40">
        <Link
          to="/profile"
          className="relative flex h-14 w-14 items-center justify-center
                     rounded-full bg-blue-600 text-white shadow-lg"
        >
          <BsFillAlarmFill className="text-2xl" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center
                           justify-center rounded-full bg-yellow-400 text-xs font-bold text-gray-900">
            {upcoming.length}
          </span>
        </Link>
      </motion.div>
    );
  }

  // ================= COMPACT =================
  if (compact) {
    const soon = upcoming[0];

    const days = differenceInDays(soon.target, Date.now());
    const hours = differenceInHours(soon.target, Date.now()) % 24;
    const minutes = differenceInMinutes(soon.target, Date.now()) % 60;

    return (
      <motion.div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white shadow">
        <div className="flex items-center gap-3">
          <BsFillAlarmFill className="text-yellow-300" />
          <span>
            {days}d {hours}h {minutes}m
          </span>
        </div>

        <button onClick={() => setDismissed(true)}>
          <IoClose />
        </button>
      </motion.div>
    );
  }

  // ================= FULL =================
  const handleDelete = async (id) => {
    await removeGoal(id);
    toast.info("Interview goal removed");
    setAskDelete(null);
  };

  return (
    <div className="grid gap-6">
      {upcoming.map((goalItem) => {
        const target = goalItem.target;

        const days = differenceInDays(target, Date.now());
        const hours = differenceInHours(target, Date.now()) % 24;
        const minutes = differenceInMinutes(target, Date.now()) % 60;

        return (
          <motion.div
            key={goalItem._id}
            className="p-6 rounded-xl bg-blue-600 text-white shadow"
          >
            <button onClick={() => setAskDelete(goalItem._id)}>
              <IoClose />
            </button>

            {askDelete === goalItem._id && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded">
                  <p>Delete this goal?</p>
                  <button onClick={() => handleDelete(goalItem._id)}>
                    Delete
                  </button>
                  <button onClick={() => setAskDelete(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold">
              {goalItem.company}
            </h2>

            <div>
              ⏳ {days}d {hours}h {minutes}m left
            </div>

            <p>
              Target Date: {format(target, "dd MMM yyyy")}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}