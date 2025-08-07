"use client";

import { fetchAppStatistics } from "@/api/admin-service";
import { IStats } from "@/types/AdminPageProps";
import { useEffect, useState, useTransition } from "react";

const useFetchStats = (): [boolean, IStats | null, string | null] => {
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState<IStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Access token is missing.");
      return;
    }

    startTransition(() => {
      fetchAppStatistics(token)
        .then((res) => (res ? setStats(res) : setStats(null)))
        .catch((err) => {
          console.error("Failed to fetch statistics:", err);
          setError("Failed to load statistics.");
        });
    });
  }, []);

  return [isPending, stats, error];
};

export default useFetchStats;
