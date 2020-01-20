<template>
    <el-dialog
        :visible.sync="visible"
        :title="!dataForm.id ? $t('add') : $t('update')"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="dataRule"
            :label-width="$i18n.locale === 'en-US' ? '120px' : '80px'"
            @keyup.enter.native="dataFormSubmitHandle()">
            <el-form-item
                :label="$t('process.instanceId')"
                prop="processInstanceId"
                hidden="true">
                <el-input
                    v-model="dataForm.processInstanceId"
                    :placeholder="$t('process.instanceId')"/>
            </el-form-item>
            <el-form-item
                :label="$t('process.taskId')"
                prop="taskId"
                hidden="true">
                <el-input
                    v-model="dataForm.taskId"
                    :placeholder="$t('process.taskId')"/>
            </el-form-item>
            <el-form-item
                :label="$t('process.days')"
                prop="days">
                <el-input-number
                    v-model="dataForm.days"
                    :placeholder="$t('process.days')"/>
            </el-form-item>
        </el-form>
        <template slot="footer">
            <el-button @click="visible = false">
                {{ $t('cancel') }}
            </el-button>
            <el-button
                type="primary"
                @click="dataFormSubmitHandle()">
                {{ $t('confirm') }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce';
import qs from 'qs';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: '',
                taskId: '',
                creator: '',
                createDate: '',
                processInstanceId: '',
                days: ''
            }
        };
    },
    computed: {
        dataRule() {
            return {
                days: [
                    { required: true, message: this.$t('validate.required'), trigger: 'blur' }
                ]
            };
        }
    },
    methods: {
        init() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.taskId) {
                    this.getInfo();
                }
            });
        },
        // 获取信息
        getInfo() {
            var params = qs.stringify({
                'taskId': this.dataForm.taskId,
                'variableName': 'days'
            });
            this.$http.post('/act/task/getTaskVariables', params).then(({ data: res }) => {
                if (res.code !== 0) {
                    return this.$message.error(res.msg);
                }
                this.dataForm = {
                    ...this.dataForm,
                    ...res.data
                };
            }).catch(() => {});
        },
        // 表单提交
        dataFormSubmitHandle: debounce(function() {
            this.$refs['dataForm'].validate((valid) => {
                if (!valid) {
                    return false;
                }
                var params = {
                    taskId: this.dataForm.taskId,
                    params: {
                        days: this.dataForm.days
                    }
                };

                this.$http['post']('/act/task/completeTaskByValiables/', params).then(({ data: res }) => {
                    if (res.code !== 0) {
                        return this.$message.error(res.msg);
                    }
                    this.$message({
                        message: this.$t('prompt.success'),
                        type: 'success',
                        duration: 500,
                        onClose: () => {
                            this.visible = false;
                            this.$emit('refreshDataList');
                        }
                    });
                }).catch(() => {});
            });
        }, 1000, { 'leading': true, 'trailing': false })
    }
};
</script>
