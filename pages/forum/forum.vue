<template>
	<view>
		<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input v-model="matchStr" :adjust-position="false" type="text" placeholder="搜索话题..." confirm-type="search"></input>
				</view>
				<view class="action">
					<button class="cu-btn bg-green shadow-blur round" @click="searchBlur">搜索</button>
				</view>
		</view>
		<!-- 总话题是和创建话题- -->
		<view style="display: flex;">
			<view class="my_card bg-olive">
				<view>
					<view style="width: 60%;text-align: left;display: inline-block;" class="card_text">总话题：</view>
					<view style="width: 40%;text-align: right;display: inline-block;font-size: 52rpx;" class="cuIcon-list text-white"></view>
				</view>
				<view>
					<view class="card_text"><text  style="line-height: 2.5;">{{totalTopic}}</text></view>
				</view>
			</view>
			<view class="my_card bg-orange" @click="toCreateOption">
				<view>
					<view style="width: 60%;text-align: left;display: inline-block;" class="card_text">创建话题：</view>
					<view style="width: 40%;text-align: right;display: inline-block;font-size: 52rpx;" class="cuIcon-add text-white"></view>
				</view>
				<view>
					<view class="card_text"><text  style="line-height: 2.5;">click me</text></view>
				</view>
			</view>
		</view>
	
	<!-- 搜索结果 -->
	<view v-if="isSearch">
		<view class="cu-bar justify-left bg-white">
			<view class="action border-title">
				<text class="text-xl text-bold text-blue">搜索结果</text>
				<text class="bg-gradual-blue" style="width:3rem"></text>
			</view>
		</view>
		<!-- list -->
		<view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item, index) in searchList" :key="index" >
					<view class="cu-avatar round lg" :style="item.user_avatar"></view>
					<view class="content" @click="toDetail(item)">
						<view class="text-grey">{{item.user_name}}</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								<!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
								{{item.topic_text}}
							</view> </view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">{{item.create_date | dateFormat}}</view>
						<text class="cuIcon-appreciate text-red">{{item.topic_love}}</text>
						<text @click="deleteTopic(item.id)" v-if="USERID == item.user_id" class="cuIcon-delete"></text>
					</view>
				</view>
			</view>
		</view>
		<!-- List end -->
	</view>
	
		<!-- 热门话题 -->
		<view>
			<view class="cu-bar justify-left bg-white">
				<view class="action border-title">
					<text class="text-xl text-bold text-blue">最新话题</text>
					<text class="bg-gradual-blue" style="width:3rem"></text>
				</view>
			</view>
			<!-- list -->
			<view>
				<view class="cu-list menu-avatar">
					<view class="cu-item" v-for="(item, index) in newList" :key="index" >
						<view class="cu-avatar round lg" :style="item.user_avatar"></view>
						<view class="content" @click="toDetail(item)">
							<view class="text-grey">{{item.user_name}}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
									{{item.topic_text}}
								</view> </view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">{{item.create_date | dateFormat}}</view>
							<text class="cuIcon-appreciate text-red">{{item.topic_love}}</text>
							<text @click="deleteTopic(item.id)" v-if="USERID == item.user_id" class="cuIcon-delete"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- List end -->
		</view>
		
		<!-- 最新话题 -->
		<view style="margin-top: 15rpx;">
			<view class="cu-bar justify-left bg-white">
				<view class="action border-title">
					<text class="text-xl text-bold text-blue">热门话题</text>
					<text class="bg-gradual-blue" style="width:3rem"></text>
				</view>
			</view>
			<!-- list -->
			<view>
				<view class="cu-list menu-avatar">
					<view class="cu-item" v-for="(item, index) in hotList" :key="index" >
						<view class="cu-avatar round lg" :style="item.user_avatar"></view>
						<view class="content" @click="toDetail(item)">
							<view class="text-grey">{{item.user_name}}</view>
							<view class="text-gray text-sm flex">
								<view class="text-cut">
									<!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
									{{item.topic_text}}
								</view> </view>
						</view>
						<view class="action">
							<view class="text-grey text-xs">{{item.create_date | dateFormat}}</view>
							<text class="cuIcon-appreciate text-red">{{item.topic_love}}</text>
							<text @click="deleteTopic(item.id)" v-if="USERID == item.user_id" class="cuIcon-delete"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- List end -->
		</view>
		
		<!-- model 新增话题对话框 -->
		<view class="cu-modal" :class="showModel">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">创建话题</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view style="text-align: left;height: 200rpx;padding-left: 35rpx;">
					<textarea style="height: 200rpx;" maxlength="30" v-model="newOptionText" placeholder="请输入话题(30字)"></textarea>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="enshureCreateOption">确定</button>
					</view>
				</view>
			</view>
		</view>
		
		<view style="height: 50rpx;"></view>
	</view>
</template>

<script>
	import BASE_HOST from '../../util/util.js'
	export default {
		data() {
			return {
				isSearch: false,
				showModel: '',
				newOptionText: '',
				hotList: [],
				newList: [],
				pageSize: 5,
				pageNum: 1,
				totalNum: 0,
				totalTopic: 0,
				matchStr: '',
				searchList: [],
				USERID: 0
			}
		},
		filters: {
			dateFormat(value) {
				var d = new Date(value)
				return (d.getMonth() + 1) + '-' + d.getDate()
			}
		},
		onShow() {
			this.getHotTopic()
			this.getNewTopic()
			this.getTotalTopic()
			this.USERID = uni.getStorageSync('local_userinfo').token
		},
		watch: {
			'matchStr': function(val) {
				if(val === '') {
					this.isSearch = false
				}
			}
		},
		methods: {
			toDetail(item) {
				uni.navigateTo({
					url:'./forum_detail?id=' + item.id
				})
			},
			deleteTopic(id) {
				var _this = this
				uni.request({
					url: BASE_HOST + 'topic/delete',
					method: 'GET',
					data: {
						id: id
					},
					success(res) {
						uni.showToast({
						    title: '删除成功!',
						    duration: 2000
						});
						_this.getHotTopic()
						_this.getNewTopic()
						_this.getTotalTopic()
						_this.searchBlur()
					}
				})
			},
			getNewTopic() {
				var _this = this
				uni.request({
					url: BASE_HOST + 'topic/getNewTopic',
					method: 'GET',
					data: {
						pageSize: 3,
					},
					success(res) {
						_this.newList = res.data.data
						_this.newList.forEach((item, index)=> {
							if(item.user_avatar.substr(0, 5) === 'https') {
								item.user_avatar = 'background-image:url(' + item.user_avatar + ');'
							} else {
								item.user_avatar = 'background-image:url(' + BASE_HOST + item.user_avatar + ');'
							}
						})
					}
				})
			},
			getHotTopic() {
				var _this = this
				uni.request({
					url: BASE_HOST + 'topic/getHotTopic',
					method: 'GET',
					data: {
						pageSize: 6,
					},
					success(res) {
						_this.hotList = res.data.data
						_this.hotList.forEach((item, index)=> {
							if(item.user_avatar.substr(0, 5) === 'https') {
								item.user_avatar = 'background-image:url(' + item.user_avatar + ');'
							} else {
								item.user_avatar = 'background-image:url(' + BASE_HOST + item.user_avatar + ');'
							}
						})
					}
				})
			},
			enshureCreateOption() {
				if(this.newOptionText === '') {
					uni.showToast({
						title: '请填写话题！',
						duration: 2000,
						icon: 'none'
					})
					return
				}
				var _this = this
				uni.request({
					url: BASE_HOST + 'topic/add',
					method: 'POST',
					data: {
						userId: uni.getStorageSync('local_userinfo').token,
						topicText: _this.newOptionText
					},
					success(res) {
						console.log(res.data)
						if(res.data.code === 20000) {
							_this.showModel = ''
							uni.showToast({
								title: '新增成功',
								duration: 2000
							})
						}
					}
				})
			},
			toCreateOption() {
				this.showModel = 'show'
			},
			hideModal() {
				this.showModel = ''
			},
			searchBlur() {
				this.isSearch = true
				if(this.matchStr === '') {
					return
				}
				var _this = this
				uni.request({
					url:BASE_HOST + 'topic/search',
					method:'GET',
					data:{
						matchStr: _this.matchStr
					},
					success(res) {
						_this.searchList = res.data.data
						if (_this.searchList.length === 0) {
							uni.showToast({
							    title: '未搜索到相关信息',
							    duration: 2000,
									icon:'none'
							});
							_this.isSearch = false
							return
						}
						_this.searchList.forEach((item, index)=> {
							if(item.user_avatar.substr(0, 5) === 'https') {
								item.user_avatar = 'background-image:url(' + item.user_avatar + ');'
							} else {
								item.user_avatar = 'background-image:url(' + BASE_HOST + item.user_avatar + ');'
							}
						})
					}
				})
			},
			getTotalTopic(){
				var _this = this
				uni.request({
					url:BASE_HOST + 'topic/count',
					method:'GET',
					success(res) {
						_this.totalTopic = res.data.data.totalTopic
					}
				})
			}
		}
	}
</script>

<style>
.my_card{
	flex: 1;

	padding: 30rpx;
	border-radius: 12rpx;
	width: 45%;
	height: 180rpx;
	margin: 0 2.5% 40rpx;
	background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}
.card_text{
	font-size: 32rpx;
}
.card_text:first-letter{
	font-size: 36rpx;
}
</style>
