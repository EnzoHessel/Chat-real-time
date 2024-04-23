"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id }
    })

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Erro ao criar Thread: ${error.message}`)
  }

}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmont = (pageNumber - 1) * pageSize;

  const postQuery = Thread.find({ parentId: { $in: [null, undefined]}})
    .sort({ createdAt: 'desc'})
    .skip(skipAmont)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: 'user',
        select: "+id name parentId image"
      }
    })

    const totalPostCont = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})

    const posts = await postQuery.exec();

    const isNext = totalPostCont > skipAmont + posts.length

    return { posts, isNext };
}