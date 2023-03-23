import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc"
import { z } from "zod";
import { postSchema } from "~/components/CreatePost";


export const postRouter = createTRPCRouter({
    create: protectedProcedure
    .input(postSchema)
    .mutation(({ctx, input})=>{
        const {prisma, session} = ctx
        const {text, title, img} = input
        const userId = session.user.id

        return prisma.post.create({
            data: {
                text,
                title,
                img,
                author: {
                    connect: {
                        id: userId, 
                    }
                }
            }
        })
    }),

    timeline: publicProcedure
    .input(

        z.object({
            where: z.object({
                author: z.object({
                    name: z.string().optional()
                }).optional()
            }).optional(),
            cursor: z.string().nullish(),
            limit: z.number().min(1).max(100).default(10)
        })
    )
    .query(async({ ctx, input }) => {
      const {prisma,} = ctx;
      const {cursor, limit, where} = input;

      const userId = ctx.session?.user?.id

      const posts= await prisma.post.findMany({
        take: limit + 1,
        where, 
        orderBy: [
            {
                createdAt: 'desc'
            },
        ],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
            likes: {
                where: {
                    userId,
                },
                select: {
                    userId: true
                }
            },
            author: {
                select: {
                    name:true,
                    image:true,
                    id:true,
                }
            },

            _count:{
                select:{
                    likes:true
                }
            }
        }
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if(posts.length > limit){
        const nextItem = posts.pop() as typeof posts[number]
        nextCursor = nextItem.id;
      }
      return {
        posts,
        nextCursor

      }
    }),

    like: protectedProcedure
    .input(
        z.object({
            postId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const { prisma } = ctx
        return prisma.like.create({
            data: {
                post: {
                    connect: {
                        id: input.postId,
                    },
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }),

    unlike: protectedProcedure
    .input(
        z.object({
            postId: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const { prisma } = ctx
        return prisma.like.delete({
            where: {
                postId_userId: {
                    postId: input.postId, 
                    userId
                },
            },
        });
    })
    

})