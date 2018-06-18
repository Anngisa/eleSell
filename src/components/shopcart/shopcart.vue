<template>
	<div class="shopcart">
		<div class="content" @click="togglelist">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highLight':totalCount>0}">
						<span class="icon-shopping_cart" :class="{'highLight':totalCount>0}"></span>
					</div>
					 <div class="mun" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highLight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<transition name="flod">
			<div class="shopcart-list" v-show="listshow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span >￥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
	</div>
</template>
<script type="ecmascript-6">
	import BScroll from 'better-scroll';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	export default{  
		props:{   
			selectFoods:{
				type:Array,
				default() {
					return []   
				}
			},
			deliveryPrice:{
				type:Number,
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				flod:true
			}
		},
		computed:{
			totalPrice(){
				let total=0;
				this.selectFoods.forEach((food)=>{
					total+=food.price*food.count;
				})
				return total
			},
			totalCount(){
				let count=0;
				this.selectFoods.forEach((food)=>{
					count+=food.count;
				})
				return count;
			},
			payDesc(){
				if(this.totalPrice===0){
					return `￥${this.minPrice}元起送`;
				}else if(this.totalPrice<this.minPrice){
					let diff=this.minPrice-this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return "去结算";
				}
			},
			payClass(){
				if(this.totalPrice<this.minPrice){
					return 'not-enough'
				}else{
					return 'enough'
				}
			},
			listshow(){
				if(!this.totalCount){
					this.flod=true;
					return false
				}
				let show=!this.flod;
				if(show){
					this.$nextTick(()=>{
						if(!this.scroll){
							this.scroll=new BScroll(this.$refs.listContent,{
								click:true
							})
						}else{
							this.scroll.refresh();
						}
						
					})
				}
				return show;
			}
		},
		methods:{
			togglelist(){
				if(!this.totalCount){
					return
				}
				this.flod=!this.flod;
			}
    },
    components:{
    	cartcontrol
    }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/index.styl'
	.shopcart
		position:fixed
		left:0
		bottom:0
		z-index:50
		width:100%
		height:48px
		.content
			background:#141d27
			display:flex
			font-size:0
			.content-left
				flex:1
				.logo-wrapper
					display:inline-block
					position:relative
					top:-10px
					margin:0 12px
					padding:6px
					width:56px
					height:56px
					box-sizing:border-box
					vertical-align:top
					border-radius:50%
					background:#141d27
					.logo
						display:inline-block
						width:100%
						height:100%
						border-radius:50%
						background:#2b343c
						text-align:center
						&.highLight
							background:rgb(0,160,220)
						.icon-shopping_cart
							font-size:24px
							line-height:44px
							color:#80858a
							&.highLight
								color:#fff
					.mun
						position:absolute
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align:center
						border-radius:16px
						font-size:9px
						font-weight:700
						color:#fff
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
						background:rgb(240,20,20)
				.price
					display:inline-block
					vertical-align:top
					line-height:24px
					margin-top:12px
					padding-right:12px
					box-sizing:border-box
					border-right:1px solid rgba(255,255,255,0.1)
					font-size:16px
					font-weight:700
					color:rgba(255,255,255,0.4)
				.desc
					display:inline-block
					vertical-align:top
					margin:12px 0 0 12px
					line-height:24px
					font-size:10px
					font-weight:700
					color:rgba(255,255,255,0.4)
			.content-right
				flex:0 0 105px
				width:105px
				.pay
					font-size:12px
					line-height:48px
					height:48px
					text-align:center
					color:rgba(255,255,255,0.4)
					font-weight:700
					background:#2b333b
					&.not-enough
						background:#2b333b
					&.enough
						background:#00b43c
						color:#fff
		.shopcart-list
			position:absolute
			top:0
			left:0
			z-index:-1
			width:100%
			transform: translate3d(0, -100%, 0)
			&.flod-enter-active,&.flod-leave-active
				transition:all 0.5s
			&.flod-enter,&.flod-leave-active
				transform:translate3d(0,0,0)
			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background:#f3f5f7
				border-bottom:2px solid rgba(7,17,27,0.1)
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.list-content
				padding:0 18px
				max-height:217px
				background:#fff
				overflow:hidden
				.food
					position:relative
					padding:12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:rgb(240,20,20)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
</style>