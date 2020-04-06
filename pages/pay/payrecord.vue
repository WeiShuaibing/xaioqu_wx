<template>
	<view>
		<view class="cu-list menu">
			<view class="cu-item" v-for="(item, index) in payList" :key="index">
					<view class="content padding-tb-sm">
						<view>
							<text class="cuIcon-lightfill text-yellow margin-right-xs"></text> 
							<view class='cu-tag bg-cyan' v-if="item.pay_type===1">物业费</view>
							<view class='cu-tag bg-blue' v-if="item.pay_type===2">停车费</view>
							<view class='cu-tag bg-olive' v-if="item.pay_type===3">水费</view>
							<view class='cu-tag bg-red' v-if="item.pay_type===4">电费</view>
							<text style="margin-left:8rpx;">{{item.payText}}</text>
						</view>
						<view class="text-gray text-sm">
							<text class="cuIcon-timefill margin-right-xs"></text> 截止时间：{{item.pay_enddate | dateFormat}}
							<br>
							<text class="cuIcon-title margin-right-xs"></text> 备注： {{item.pay_remark}}
						</view>
					</view>
					<view class="action">
						<button class="cu-btn bg-yellow text-yellow" disabled>￥{{item.pay_money}}</button>
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				payList: []
			}
		},
		filters: {
		    dateFormat(value) {
		      var d = new Date(value)
		      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
		    }
		},
		mounted() {
			this.getAllPayRecord()
		},		
		methods: {
			getAllPayRecord() {
				var _this = this
				uni.request({
					url:BASE_HOST + 'payrecord/getMyRecord',
					method:'GET',
					header:{
						YQYJToken: uni.getStorageSync('local_userinfo').token
					},
					success(res) {
						_this.payList = res.data.data
						console.log(_this.payList)
					}
				})
			}
		}
	}
</script>

<style>

</style>
