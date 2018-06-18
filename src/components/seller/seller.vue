<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<star :size="36" :score="seller.score" ></star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress"><span class="number">{{seller.minPrice}}</span>元</span>
						</div>
					</li>
					<li class="block">
						<h2>商家配售</h2>
						<div class="content">
							<span class="stress"><span class="number">{{seller.deliveryPrice}}</span>元</span>
						</div>
					</li>
					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress"><span class="number">{{seller.deliveryTime}}</span>分钟</span>
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleclick">
					<span class="icon-favorite" :class="{'active':favorite}"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<split></split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">	
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<div v-if="seller.supports" class="support">
					<div class="support-item border-1px" v-for="(item,index) in seller.supports">
						<span class="icon" :class="classMap[seller.supports[index].type]"></span>
						<span class="text">{{seller.supports[index].description}}</span>
					</div>
				</div>
			</div>
			<split></split>
			<div class="pics">
				<h1 class="title">商家实拍</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" id="piList">
						<li class="pic-item" v-for="pics in seller.pics">
								<img :src="pics" width='120' height="90">
						</li>
					</ul>
				</div>
			</div>	
			<split></split>
			<div class="info">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li class="info-item" v-for="info in seller.infos">
						{{info}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script type="text-ecmascript-6">
	import star from '../star/star.vue';
	import split from '../split/split.vue';	
	import BScroll from 'better-scroll';
	import {saveToLocal,loadFromLacal} from '../../common/js/store.js'

	export default{
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return {
				favorite:false
			}
		},
		computed:{
			favoriteText() {
				return this.favorite?'已收藏':'收藏';
			}
		},
		created(){
				this.classMap=['decrease','discount','special','invoice','guarantee']
		},
		mounted(){
			//渲染真是dom
			if(!this.scroll){
				this.scroll=new BScroll(this.$refs.seller,{
					click:true
				})
			}else{
				this.scroll.refresh()
			}
			if(this.seller.pics){
				let picWidth=120;
				let picMargin=16;
				let width=(picWidth+picMargin)*this.seller.pics.length-picMargin;
				this.$nextTick(()=>{
					document.getElementById("piList").style.width=width+"px"
					this.picScroll=new BScroll(this.$refs.picWrapper,{
						scrollX:true,
						eventPassthrough:'vertical'
					})
				})
			}
		},
		methods:{
			toggleclick(event){
				console.log(this.favorite)
				this.favorite=!this.favorite;	
				saveToLocal(this.seller.id,'favorite',this.favorite)

			}
		},
		components:{
			star,
			split
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/index.styl'

	.seller
		position:absolute
		top:174px
		bottom:0
		left:0
		width:100%  
		overflow:hidden
		.overview
			padding:18px
			.title
				margin-bottom:8px
				line-height:14px
				color:rgb(7,17,27)
				font-size:14px
			.desc
				font-size:0
				border-1px(rgba(7,17,27,0.1))
				.star
					display:inline-block
					margin-right:8px
				.text
					display:inline-block
					vertival-align:top
					font-size:10px
					margin-right:12px
					color:rgb(7,17,27)
			.remark
				display:flex
				padding-top:18px
				.block
					flex:1
					text-align:center
					border-right:1px solid rgba(7,17,27,0.1)
					&:last-child
						border:none
					h2
						margin-bottom:4px
						line-height:10px
						font-size:10px
					.content
						line-height:24px
						font-size:0px
						color:rgb(7,17,27)
						.stress
							font-size:14px
							.number
								font-size:24px
			.favorite
				position:absolute	
				right:18px
				top:16px
				text-align:center
				width:40px
				.icon-favorite
					display:block
					margin-bottom:4px
					color:#d4d6d9
					line-height:20px
					font-size:20px
					&.active
						color:rgb(240,20,20)
				.text
					line-height:10px
					font-size:10px
					color:rgb(7,17,27)
		.bulletin
			padding:18px 18px 0 18px
			.title
				margin-bottom:8px
				line-height:14px
				color:rgb(7,17,27)
			.content-wrapper
				padding:0 12px 16px 12px 
				border-1px(rgba(7,17,27,0.1))
				.content
					line-height:24px
					font-size:12px
					color:rgb(240,20,20)
			.support
				.support-item
					padding:16px 12px
					border-1px(rgba(7,17,27,0.1))
					font-size:0
					&:last-child
						border-none()
					.icon
						vertical-align:top
						display:inline-block
						width:12px
						height:12px
						margin-right:2px
						background-size:12px 12px
						background-repeat:no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.text
						font-size:12px
						line-height:16px
						color:rgb(7,17,27)
						vertical-align:top
		.pics
			padding:18px
			.title
				margin-bottom:12px
				line-height:14px
				color:rgb(7,17,27)
				font-size:14px
			.pic-wrapper
					width:100%
					overflow:hidden
					white-space:nowrap
					.pic-list
						font-size:0
						.pic-item
							display:inline-block
							margin-right:6px
							width:120px
							height:90px
							&:last-child
								margin-right:0
		.info
			padding:18px 18px 0 18px
			color:rgb(7,17,27)
			.title
				padding-bottom:12px
				line-height:14px
				color:rgb(7,17,27)
				font-size:14px
				border-1px(rgba(7,17,27,0.1))
			.info-item
				padding:16px 12px
				line-height:16px
				border-1px(rgba(7,17,27,0.1))
				font-size:12px
				&:last-child
					border-none()
 </style>
