<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"  @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper" id="ddd">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,index) in item.foods" class="food-item border-1px" @click="selectFood(food,$event,index)">
							<div class="icon">
								<img :src="food.icon" width="57" height="57" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		<food :food="selectedFood" ref="food"></food>
</div>
</template>
<script type="text-ecmascript-6">
	import BScroll from 'better-scroll';
	import shopcart from '../shopcart/shopcart.vue';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import food from '../food/food.vue';
	export default{
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return {
				goods:[],
				listHeight:[],
				scrollY:0,
				ind:'',
				selectedFood:{}
			}
		},
		computed:{
			currentIndex(){
				for(let i=0;i<this.listHeight.length;i++){
					let height1=this.listHeight[i];
					let height2=this.listHeight[i+1];
					if(!height2||this.scrollY>=height1&&this.scrollY<height2){
						return i;
					}
				}
				return 0;
			},
			selectFoods(){
				let foods=[];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{
						if(food.count){
							foods.push(food)
						}
					})
				})
				return foods;
			}
		},
		created(){
			this.classMap=['decrease','discount','special','invoice','guarantee'],
			this.$axios.get('/api/goods').then((response)=>{
				this.goods=response.data.data;
				this.$nextTick(()=>{
					this._initScroll();
					this._calculateHeight();
				})

			})
		},
		methods:{
			selectMenu(index,event){
		        console.log(index);
		        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
		      	let el=foodList[index];
		      	this.foodScroll.scrollToElement(el,300);
		      	this.ind=index;
			},
			selectFood(food,event,index){				
				this.selectedFood=food;
				this.$refs.food.show();
			},
			_initScroll(){
				this.menuScroll=new BScroll(this.$refs.menuWrapper,{
					click:true
				});
				this.foodScroll=new BScroll('#ddd',{
					probeType:3,
					click:true
				})
				this.foodScroll.on('scroll',(pos)=>{
					this.scrollY=Math.abs(Math.round(pos.y))
				})
			},
			_calculateHeight(){
				let foodList=this.$refs.foodsWrapper.getElementsByClassName("food-list-hook");
				let height=0;
				this.listHeight.push(height);
				for(let i=0;i<foodList.length;i++){
					let item=foodList[i];
					height+=item.clientHeight;
					this.listHeight.push(height);
				}
			},
			cartAdd(el){
			}
		},
		components:{
			shopcart,
			cartcontrol,
			food
		}
	};
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
	@import "../../common/stylus/index.styl"
	.goods
		position:absolute
		width:100%
		top:174px
		bottom:46px
		display:flex
		overflow:hidden
		.menu-wrapper
			flex:0 0 80px
			width:80px
			background-color:#f3f5f7
			.menu-item
				display:table
				width:56px
				height:54px
				line-height:14px
				padding:0 12px
				&.current
					margin-top:-1px
					position:relative
					z-index:10
					background-color:#fff
					font-weight:700
					.text
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
					display:table-cell
					width:56px
					vertical-align:middle
					font-size:12px
					border-1px(rgba(7,17,27,0.1))
		.foods-wrapper
			flex:1
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background-color:#f3f5f7
			.food-item
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc,.extra
						line-height:10px
						color:rgb(147,153,159)
						font-size:10px
					.desc
						margin-bottom:8px
						line-height:12px
					.extra
						.count
							margin-right:12px
					.price
						line-height:24px
						font-weight:700
						.now
							font-size:14px
							margin-right:8px
							color:rgb(240,20,20)
						.old
							font-size:10px
							text-decoration:line-through
							color:rgb(147,153,159)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:12px
</style>
