import { Component, tags, hooks, router } from "@odoo/owl";
const { useGetters } = hooks;
const { Link } = router;
import { useApi } from "../hooks/useApi";

const ARTICLE_META_PAGE_TEMPLATE = tags.xml/* xml */ `
<div class="article-meta">
    <a href=""><img t-att-src="props.article.author.image" /></a>
    <div class="info">
        <a href="#" class="author" t-esc="props.article.author.username"></a>
        <span class="date" t-esc="getArticleDate(props.article.createdAt)"></span>
    </div>
    <span t-if="!userIsAuthor()">
        <button t-attf-class="btn btn-sm {{ props.article.author.following ? 'btn-secondary' : 'btn-outline-secondary' }}" t-on-click="toggleFollowAuthor" t-att-disabled="props.updatingFollowing">
            <i class="ion-plus-round"></i> <t t-esc="props.article.author.following ? 'Unfollow' : 'Follow'"/> <t t-esc="props.article.author.username"/>
        </button> 
        <button t-attf-class="btn btn-sm {{ props.article.favorited ? 'btn-primary': 'btn-outline-primary' }}" t-att-disabled="props.updatingFavorited" t-on-click="toggleFavoriteArticle">
            <i class="ion-heart"></i> <t t-esc="props.article.favorited ? 'Unfavorite': 'Favorite'"/> Post
            <span class="counter">(<t t-esc="props.article.favoritesCount"/>)</span>
        </button>
    </span>
    <span t-if="userIsAuthor()">
        <Link class="btn btn-outline-secondary btn-sm" to="'EDITOR'">
            <i class="ion-edit"></i> Edit Article
        </Link>

        <button t-attf-class="btn btn-outline-danger btn-sm" t-on-click="deleteArticle">
            <i class="ion-trash-a"></i> Delete Article
        </button>
    </span>
</div>
`;
export class ArticleMeta extends Component {
  static template = ARTICLE_META_PAGE_TEMPLATE;
  static components = { Link };
  conduitApi = useApi();
  getters = useGetters();
  static props = {
    article: { type: Object },
    updatingFollowing: { type: Boolean, optional: true },
    updatingFavorited: { type: Boolean, optional: true },
    deletingArticle: { type: Boolean, optional: true },
  };

  getArticleDate(date) {
    let articleDate = new Date(date);
    return articleDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  toggleFollowAuthor() {
    let following = !this.props.article.author.following;
    this.trigger("update-following", {
      following: following,
    });
  }
  toggleFavoriteArticle() {
    let favorited = !this.props.article.favorited;
    let favoritesCount = favorited
      ? this.props.article.favoritesCount + 1
      : this.props.article.favoritesCount - 1;
    this.trigger("update-favorited", {
      favoritesCount: favoritesCount,
      favorited: favorited,
    });
  }
  deleteArticle() {
    this.trigger("delete-article", {
      slug: this.props.article.slug,
    });
  }
  userIsAuthor() {
    return (
      this.getters.userLoggedIn() &&
      this.getters.getUser().username == this.props.article.author.username
    );
  }
}
