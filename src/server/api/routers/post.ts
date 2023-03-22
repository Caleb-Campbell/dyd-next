import { publicProcedure, protectedProcedure, createTRPCRouter } from "../trpc"
import { z } from "zod";
import { postSchema } from "~/components/CreatePost";


export const postRouter = createTRPCRouter({
    create: protectedProcedure
    .input(postSchema)
    .mutation(({ctx, input})=>{
        const {prisma, session} = ctx
        const {text, title} = input
        const userId = session.user.id

        return prisma.post.create({
            data: {
                text,
                title,
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
            cursor: z.string().nullish(),
            limit: z.number().min(1).max(100).default(10)
        })
    )
    .query(async({ ctx, input }) => {
      const {prisma,} = ctx;
      const {cursor, limit} = input;

      const posts= await prisma.post.findMany({
        take: limit + 1,
        orderBy: [
            {
                createdAt: 'desc'
            },
        ],
        cursor: cursor ? { id: cursor } : undefined,
        include: {
            author: {
                select: {
                    name:true,
                    image:true,
                    id:true,
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
});