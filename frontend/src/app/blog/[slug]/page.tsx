import { MarkdownText } from "@/components/markdown-text";
import { MasonryGallery } from "@/components/masonry-gallery";
import { StrapiImage } from "@/components/strapi-image";
import { formatDate, getStrapiURL } from "@/lib/utils";
import { Block } from "@/types";
import { Metadata } from "next";
import qs from "qs";

interface Props {
  params: {
    slug: string;
  };
}

async function loader(slug: string) {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/posts";
  const baseUrl = getStrapiURL();

  const url = new URL(path, baseUrl);
  url.search = qs.stringify({
    populate: {
      image: {
        fields: ["url", "alternativeText", "name"],
      },
      category: {
        fields: ["text"],
      },
      blocks: {
        on: {
          "layout.image-gallery": {
            populate: {
              images: {
                populate: "*",
              },
            },
          },
        },
      },
    },
    filters: {
      slug: { $eq: slug },
    },
  });
  const data = await fetchData(url.href);
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await loader(params.slug);
  const { title, description } = data?.data[0];

  return {
    title: title,
    description: description,
  };
}
export default async function SinglePost({ params }: Props) {
  const data = await loader(params.slug);
  const post = data?.data[0];

  if (!post) return null;

  console.log("post", post);

  return (
    <article>
      <div>
        <header className="container mx-auto my-10">
          <h1 className="text-6xl font-bold tracking-tighter sm:text-5xl mb-4">{post.title}</h1>
          <p className="text-muted-foreground">
            Publicēts {formatDate(post.publishedAt)} - {post.category.text}
          </p>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg max-h-[70vh]">
            <StrapiImage
              src={post.image.url}
              alt={post.image.alternativeText || "Blog post image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        </header>
      </div>
      {post.blocks && post.blocks.length > 0 && post.blocks.map(BlockRenderer)}
      <div className="container mx-auto max-w-4xl text-base leading-7">
        <MarkdownText content={post.content} />
      </div>
    </article>
  );
}

function BlockRenderer(block: Block, index: number) {
  console.dir(block.__component, { depth: null });
  console.log(block, "Block Component");

  switch (block.__component) {
    case "layout.image-gallery":
      return <MasonryGallery key={index} {...block} />;
    default:
      return null;
  }
}
