type WpPost = {
    id: number;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: { rendered: string };
    content: { rendered: string; protected: false };
    excerpt: { rendered: string; protected: false };
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: false;
    template: string;
    format: string;
    categories: number[];
    tags: string[];
    meta: {
        _et_pb_use_builder: string;
        _et_pb_old_content: string;
        _et_gb_content_width: string;
        footnotes: string;
    };
};

type Post = {
    id: number;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: string;
    content: string;
    excerpt: string;
    featured_media: number;
    categories: number[];
    tags: string[];
};

class Consumer {

    constructor() {

    }

    async getData(baseUrl: string): Promise<Post[]> {
            let datas: Response = await fetch(`${baseUrl}/posts`);
            const json = (await datas.clone().json()) as WpPost[];
        return json
                .filter((o) => o.status === 'publish')
                .map((o) => {
                    return {
                        id: o.id,
                        slug: o.slug,
                        status: o.status,
                        type: o.type,
                        link: o.link,
                        title: o.title.rendered,
                        content: o.content.rendered,
                        excerpt: o.excerpt.rendered,
                        featured_media: o.featured_media,
                        categories: o.categories,
                        tags: o.tags,
                    };
                });

    }

}

export default Consumer;