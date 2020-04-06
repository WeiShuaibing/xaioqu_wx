<template>
    <view>
        <view class="content">
            <image class="logo" src="/static/img/logo.png"></image>
            <view class="text-area">
                <text class="title">豫情豫景</text>
            </view>
        </view>
        <view style="margin-top: 100rpx;">
            <form>
                <view class="cu-form-group margin-top">
                    <view class="title">账户</view>
                    <input placeholder="请输入手机号" type="number" name="input" v-model="userinfo.userPhone"></input>
                </view>
                <view class="cu-form-group">
                    <view class="title">密码</view>
                    <input password placeholder="请输入密码" name="input" v-model="userinfo.userPassword"></input>
                </view>
                <view class="cu-form-group">
                    <view class="title">密码</view>
                    <input password placeholder="请确认密码" name="input" v-model="userPassword2"></input>
                </view>
            </form>

            <!-- 兴趣选择 -->
            <view class="cu-bar bg-white margin-top">
                <view class="action">
                    <text class="cuIcon-title text-orange "></text>
                    你稀饭哪种风景哪！
                </view>
                <view class="action">
                    <button class="cu-btn bg-green shadow" @tap="showModal" data-target="ChooseModal">选择</button>
                </view>
            </view>
            <view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hideModal">
                <view class="cu-dialog" @tap.stop="">
                    <view class="cu-bar bg-white">
                        <view class="action text-blue" @tap="hideModal">取消</view>
                        <view class="action text-green" @tap="hideModal">确定</view>
                    </view>
                    <view class="grid col-3 padding-sm">
                        <view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
                            <button class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'"
                                    @tap="ChooseCheckbox"
                                    :data-value="item.value"> {{item.name}}
                                <view class="cu-tag sm round" :class="item.checked?'bg-white text-orange':'bg-orange'"
                                      v-if="item.hot">HOT
                                </view>
                            </button>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 兴趣选择 -->

            <div>
                <view class="padding-xl">
                    <button @click="regist()" open-type="getUserInfo" class="cu-btn block bg-blue margin-tb-sm lg">
                        <text class="cuIcon-pullright"></text>
                        <text style="margin-left: 8rpx;">注册</text>
                    </button>
                </view>
            </div>

        </view>
    </view>

</template>

<script>
    export default {
        data() {
            return {
                userinfo: {
                    userNickname: '',
                    userPhone: '',
                    userPassword: '',
                    userSex: '',
                    userInterest: '',
                    userAvatar: ''
                },
                userPassword2: '',
                title: 'Hello',
                modalName: null,
                userInterest: [],
                checkbox: [{
                    value: '山',
                    name: '山',
                    checked: false,
                    hot: false,
                }, {
                    value: '水',
                    name: '水',
                    checked: false,
                    hot: false,
                }, {
                    value: '园林',
                    name: '园林',
                    checked: false,
                    hot: false,
                }, {
                    value: '人文',
                    name: '人文',
                    checked: false,
                    hot: false,
                }, {
                    value: '休闲',
                    name: '休闲',
                    checked: false,
                    hot: false,
                }, {
                    value: '地质地貌',
                    name: '地质地貌',
                    checked: false,
                    hot: false,
                }, {
                    value: '宗教圣地',
                    name: '宗教圣地',
                    checked: false,
                    hot: false,
                }]
            }
        },
        onLoad() {
        },
        methods: {
            regist() {
                if (this.userinfo.userPhone.length != 11) {

                    uni.showToast({
                        title: '请输入正确的手机号',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                } else if (this.userInterest.length == 0) {
                    uni.showToast({
                        title: '请选择个人爱好哦',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                } else if (this.userinfo.userPassword.length < 6) {
                    uni.showToast({
                        title: '密码太简单喽',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                } else if (this.userPassword2 != this.userinfo.userPassword) {
                    uni.showToast({
                        title: '密码不一致',
                        duration: 2000,
                        icon: 'none'
                    });
                    return
                }
                var _this = this
                var _userinfo = this.userinfo
                var _userInterest = this.userInterest
                uni.login({
                    provider: 'weixin',
                    success: function (loginRes) {

                        uni.getUserInfo({
                            provider: 'weixin',
                            success: function (infoRes) {
                                _userinfo.userAvatar = infoRes.userInfo.avatarUrl
                                _userinfo.userNickname = infoRes.userInfo.nickName
                                if (infoRes.userInfo.gender == 1) {
                                    _userinfo.userSex = '男'
                                } else if (infoRes.userInfo.gender == 2) {
                                    _userinfo.userSex = '女'
                                } else {
                                    _userinfo.userSex = '未知'
                                }
                                _userinfo.userInterest = _userInterest.join(',')
                                _this.registUserInfo()
                            },
                            fail(err) {
                                console.log(err)
                            }
                        })
                    }
                })
            },
            registUserInfo() {
                var _userinfo = this.userinfo
                _userinfo.userPassword = this.$md5(_userinfo.userPassword)
                uni.request({
                    url: this.$BASE_HOST + 'user/regist', //仅为示例，并非真实接口地址。
                    method: 'POST',
                    data: _userinfo,
                    success: (res) => {
                        if (res.data.code === 20000) {
                            uni.showToast({
                                title: '注册成功',
                                duration: 2000
                            });
                        } else if (res.data.code = 20010) {
                            uni.showToast({
                                title: '手机号已存在',
                                duration: 2000,
                                icon: 'none'
                            });
                            return
                        } else {
                            uni.showToast({
                                title: '服务异常',
                                duration: 2000,
                                icon: 'none'
                            });
                            return
                        }
                        setTimeout(function () {
                            uni.navigateTo({
                                url: '../login/login'
                            })
                        }, 1000)

                    }, fail() {
                        uni.showToast({
                            title: '服务异常',
                            duration: 2000,
                            icon: 'none'
                        });
                    }
                });
            },
            showModal(e) {
                this.modalName = e.currentTarget.dataset.target
            },
            hideModal(e) {
                this.modalName = null
            },
            ChooseCheckbox(e) {
                let items = this.checkbox;
                let values = e.currentTarget.dataset.value;
                for (let i = 0, lenI = items.length; i < lenI; ++i) {
                    if (items[i].value == values) {
                        items[i].checked = !items[i].checked;
                        break
                    }
                }
                if (this.userInterest.indexOf(values) != -1) {
                    this.userInterest.splice(this.userInterest.indexOf(values), 1)
                } else {
                    this.userInterest.push(values)
                }
            }
        }
    }
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -70rpx;
    }

    .logo {
        height: 200rpx;
        width: 180rpx;
        margin-top: 150rpx;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 50rpx;
    }

    .text-area {
        display: flex;
        justify-content: center;
    }

    .title {
        font-size: 36rpx;
        color: #8f8f94;
    }

</style>
