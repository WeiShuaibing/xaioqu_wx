<template>
	<view>
		<view>
			<swiper class="screen-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
					 :autoplay="true" interval="5000" duration="500">
						<swiper-item v-for="(item,index) in swiperList" :key="index" @click="toDetailOfScenic(item)">
							<image :src="item.img" mode="aspectFill"></image>
						</swiper-item>
			</swiper>
		</view>
		<!-- 功能栏 -->
		<view>
			<view class="cu-list grid" style="width: 100%;display: flex;margin-top: 20rpx;">
				<view class="cu-item" style="flex: 1;" @click="toPay">
					<view class="cuIcon-moneybagfill text-yellow" style="font-size: 48rpx;">
						<view class="cu-tag badge">
							<block>{{shouldPayNum}}</block>
						</view>
					</view>
					<text style="font-size: 24rpx;">缴费</text>
				</view>
				<view class="cu-item" style="flex: 1;" @click="toRepair">
					<view class="cuIcon-repairfill text-orange" style="font-size: 48rpx;"></view>
					<text style="font-size: 24rpx;">报修</text>
				</view>
				<view class="cu-item" style="flex: 1;" @click="toSuggestion">
					<view class="cuIcon-warnfill text-olive" style="font-size: 48rpx;"></view>
					<text style="font-size: 24rpx;">投诉/建议</text>
				</view>
				<view class="cu-item" style="flex: 1;" @click="toForum">
					<view class="cuIcon-commentfill text-blue" style="font-size: 48rpx;"></view>
					<text style="font-size: 24rpx;">论坛</text>
				</view>
			</view>
		</view>

		<!-- 通知公告-->
		<view class="cu-bar bg-white" style="margin-top: 20rpx;">
			<view class="action sub-title">
				<text class="text-xl text-bold text-blue">最新公告:</text>
				<text class="text-ABC text-blue">NOTICE</text>
			</view>
		</view>
		<!--通知item-->
		<view style="margin-top: 10rpx;">
			<view class="cu-bar bg-white" v-for="(item, index) in noticeList" :key="index" style="margin-top: 2rpx;">
				<view class="action">
					<text class="cuIcon-title text-green"></text>
					<text>{{item.noText}}</text>
				</view>
			</view>
		</view>


	</view>
	<!--  -->
</template>

<script>
	import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				swiperList: [{
					img: 'http://127.0.0.1:9002/web/lunbo/1.jpg'
				},{
					img: 'http://127.0.0.1:9002/web/lunbo/2.jpg'
				},{
					img: 'http://127.0.0.1:9002/web/lunbo/3.jpg'
				},{
					img: 'http://127.0.0.1:9002/web/lunbo/4.jpg'
				}],
				noticeList: [],
				shouldPayNum: 0
			}
		},
		onShow: function() {
			this.getAllNotice()
			this.getShouldPayNum()
		},
		onLoad: function() {},
		methods: {
			getShouldPayNum(){
				var _this = this
				uni.request({
					url: BASE_HOST + 'payorder/getAllOfINotPay',
					method: 'GET',
					header:{
						XiaoQuToken: uni.getStorageSync('local_userinfo').token
					},
					success(res) {
						console.log(res.data.data)
						_this.shouldPayNum = res.data.data.length
					}
				})
			},
			toPay() {
				uni.navigateTo({
					url:'../pay/pay'
				})
			},
			toForum() {
				uni.navigateTo({
					url:'../forum/forum'
				})
			},
			toSuggestion() {
				uni.navigateTo({
					url:'../suggestion/suggestion'
				})
			},
			toRepair() {
				uni.navigateTo({
					url: '../repair/repair'
				})
			},
			getAllNotice() {
				uni.request({
				    url: BASE_HOST + 'notice/getAll',
				    success: (res) => {
							this.noticeList = res.data.data
				    }
				});
			}
		}
	}
</script>

<style>
</style>
