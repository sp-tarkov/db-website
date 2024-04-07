export interface IGiteaContentsResponse {
    name: string;
    path: string;
    sha: string;
    last_commit_sha: string;
    type: string;
    size: number;
    encoding: string | null;
    content: string | null;
    target: string | null;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    submodule_git_url: string | null;
    _links: {
        self: string;
        git: string;
        html: string;
    }
}
