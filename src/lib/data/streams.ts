import "server-only";
import { prisma } from "@/lib/db/prisma";

export async function getCurrentLiveStream() {
  return prisma.liveStream.findFirst({
    where: { status: "LIVE" },
    orderBy: { actualStart: "desc" },
  });
}

export async function getNextScheduledStream() {
  return prisma.liveStream.findFirst({
    where: { status: "SCHEDULED", scheduledStart: { gte: new Date() } },
    orderBy: { scheduledStart: "asc" },
  });
}

export async function listUpcomingStreams(take = 5) {
  return prisma.liveStream.findMany({
    where: { status: "SCHEDULED", scheduledStart: { gte: new Date() } },
    orderBy: { scheduledStart: "asc" },
    take,
  });
}

export async function listStreamHistory(take = 10) {
  return prisma.liveStream.findMany({
    where: { status: "ENDED" },
    orderBy: { actualEnd: "desc" },
    take,
    include: { relatedSermon: true },
  });
}
